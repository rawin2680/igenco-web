import { factories } from '@strapi/strapi';
import { cleanAndValidate, isRateLimited, spamReasons, MIN_FILL_MS } from '../../../utils/spam-guard';

const UID = 'api::contact-inquiry.contact-inquiry';

// Response shape a bot sees when it is silently dropped (looks like a normal success).
const fakeSuccess = (ctx: any) => {
  ctx.status = 201;
  ctx.body = { data: { id: 0, documentId: 'ok' }, meta: {} };
};

export default factories.createCoreController(UID, ({ strapi }) => ({
  async create(ctx) {
    // Logged-in admins keep the default behaviour.
    if (ctx.state?.user) return super.create(ctx);

    const headers = ctx.request.headers || {};
    const body: any = ctx.request.body || {};
    const ip = String(ctx.request.ip || 'unknown');

    // 1) Honeypot: a hidden field real people never fill.
    const honeypot = String(headers['x-form-hp'] || body?.meta?.hp || '').trim();
    if (honeypot) {
      strapi.log.info(`[spam] honeypot hit from ${ip}`);
      return fakeSuccess(ctx);
    }

    // 1b) Filled too fast to be human.
    const elapsedRaw = headers['x-form-elapsed'];
    const elapsedMs = elapsedRaw === undefined ? null : Number(elapsedRaw);
    if (elapsedMs !== null && Number.isFinite(elapsedMs) && elapsedMs < MIN_FILL_MS) {
      strapi.log.info(`[spam] too fast (${elapsedMs}ms) from ${ip}`);
      return fakeSuccess(ctx);
    }

    // 2) Rate limit per IP.
    if (isRateLimited(ip)) {
      strapi.log.info(`[spam] rate limited ${ip}`);
      return ctx.tooManyRequests('ส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่ หรือโทรหาเราโดยตรง');
    }

    // 3) Validate + whitelist fields (public users can no longer set status etc.).
    const checked = cleanAndValidate(body.data);
    if (checked.ok === false) return ctx.badRequest(checked.message);
    const data = checked.data;

    // 4) Duplicate: same email + same details in the last 24h → drop quietly.
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const dup = await strapi.documents(UID).findFirst({
      filters: { email: { $eqi: data.email }, details: data.details ? { $eq: data.details } : { $null: true }, createdAt: { $gte: since } },
    });
    if (dup) {
      strapi.log.info(`[spam] duplicate from ${ip} (${data.email})`);
      return fakeSuccess(ctx);
    }

    // 5) Heuristics: keep the message but flag it for review.
    const reasons = spamReasons(data, { elapsedMs: Number.isFinite(elapsedMs as number) ? elapsedMs : null });
    const strong = reasons.filter(r => r !== 'ไม่ได้ส่งจากหน้าเว็บ');
    const isSpam = strong.length > 0 || reasons.length >= 2;

    const entry = await strapi.documents(UID).create({
      data: { ...data, status: 'new', isSpam, spamReason: isSpam ? reasons.join(' · ').slice(0, 250) : null } as any,
    });
    if (isSpam) strapi.log.info(`[spam] flagged ${entry.documentId} from ${ip}: ${reasons.join(', ')}`);

    ctx.status = 201;
    ctx.body = { data: { id: entry.id, documentId: entry.documentId }, meta: {} };
  },
}));
