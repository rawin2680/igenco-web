import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // ----------------------------------------------------------------------
      // 1. ตั้งค่าสิทธิ์ Public API ให้ Frontend (Nuxt 3) ดึงข้อมูลได้อัตโนมัติ
      // ----------------------------------------------------------------------
      const publicRole = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const publicActions = [
          'api::news-article.news-article.find',
          'api::news-article.news-article.findOne',
          'api::product.product.find',
          'api::product.product.findOne',
          'api::client-partner.client-partner.find',
          'api::client-partner.client-partner.findOne',
          'api::site-setting.site-setting.find',
          'api::contact-inquiry.contact-inquiry.create',
        ];

        for (const action of publicActions) {
          const existing = await strapi.db
            .query('plugin::users-permissions.permission')
            .findOne({
              where: { action, role: publicRole.id },
            });

          if (!existing) {
            await strapi.db
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action,
                  role: publicRole.id,
                },
              });
          }
        }
      }

      // ----------------------------------------------------------------------
      // 2. สร้าง API Roles (sysadmin / editor) ใน Users & Permissions Plugin
      // ----------------------------------------------------------------------
      const customApiRoles = [
        {
          name: 'sysadmin',
          type: 'sysadmin',
          description: 'System Administrator — สิทธิ์สูงสุด จัดการได้ทุกส่วนและกำหนดสิทธิ์ผู้อื่นได้',
        },
        {
          name: 'editor',
          type: 'editor',
          description: 'Content Editor — อัปเดตข่าวสารและแก้ไขข้อมูลเบื้องต้นได้เท่านั้น',
        },
      ];

      for (const r of customApiRoles) {
        let roleRecord = await strapi.db
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: r.type } });
        if (!roleRecord) {
          roleRecord = await strapi.db
            .query('plugin::users-permissions.role')
            .create({ data: r });
        }

        // กำหนดสิทธิ์ API ให้ sysadmin และ editor
        const roleActions = r.type === 'sysadmin'
          ? [
              'api::news-article.news-article.find',
              'api::news-article.news-article.findOne',
              'api::news-article.news-article.create',
              'api::news-article.news-article.update',
              'api::news-article.news-article.delete',
              'api::news-article.news-article.unpublish',
              'plugin::upload.content-api.upload',
              'api::product.product.find',
              'api::product.product.findOne',
              'api::product.product.create',
              'api::product.product.update',
              'api::product.product.delete',
              'api::client-partner.client-partner.find',
              'api::client-partner.client-partner.findOne',
              'api::client-partner.client-partner.create',
              'api::client-partner.client-partner.update',
              'api::client-partner.client-partner.delete',
              'api::site-setting.site-setting.find',
              'api::site-setting.site-setting.update',
              'api::contact-inquiry.contact-inquiry.find',
              'api::contact-inquiry.contact-inquiry.findOne',
              'api::contact-inquiry.contact-inquiry.update',
              'api::contact-inquiry.contact-inquiry.delete',
              'plugin::users-permissions.user.find',
              'plugin::users-permissions.user.findOne',
              'plugin::users-permissions.user.create',
              'plugin::users-permissions.user.update',
              'plugin::users-permissions.user.me',
              'plugin::users-permissions.role.find',
            ]
          : [
              'api::news-article.news-article.find',
              'api::news-article.news-article.findOne',
              'api::news-article.news-article.create',
              'api::news-article.news-article.update',
              'api::news-article.news-article.unpublish',
              'plugin::upload.content-api.upload',
              'api::site-setting.site-setting.find',
              'api::site-setting.site-setting.update',
              'api::product.product.find',
              'api::product.product.findOne',
              'api::client-partner.client-partner.find',
              'api::contact-inquiry.contact-inquiry.find',
              'plugin::users-permissions.user.me',
            ];

        for (const action of roleActions) {
          const permExists = await strapi.db
            .query('plugin::users-permissions.permission')
            .findOne({ where: { action, role: roleRecord.id } });
          if (!permExists) {
            await strapi.db
              .query('plugin::users-permissions.permission')
              .create({ data: { action, role: roleRecord.id } });
          }
        }
      }

      // สร้างบัญชีผู้ใช้งานตัวอย่างสำหรับเข้าหน้า Admin Portal (/admin)
      const sysRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'sysadmin' } });
      const edRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'editor' } });
      const userService = strapi.plugin('users-permissions').service('user');

      // รหัสผ่านอ่านจาก env (SEED_SYSADMIN_PASSWORD / SEED_EDITOR_PASSWORD)
      // บน production ถ้าไม่ได้ตั้งค่า จะไม่สร้างบัญชีนั้น เพื่อไม่ให้มีรหัสผ่านที่เดาได้
      const isProd = process.env.NODE_ENV === 'production';
      const seedPassword = (envName: string, devDefault: string) => {
        const value = process.env[envName];
        if (value) return value;
        if (isProd) {
          strapi.log.warn(`IGENCO Bootstrap: ${envName} is not set, skipping this seed account.`);
          return null;
        }
        return devDefault;
      };
      const sysEmail = process.env.SEED_SYSADMIN_EMAIL || 'sysadmin@igenco.co.th';
      const edEmail = process.env.SEED_EDITOR_EMAIL || 'editor@igenco.co.th';
      const sysPassword = seedPassword('SEED_SYSADMIN_PASSWORD', 'Igenco@2026');
      const edPassword = seedPassword('SEED_EDITOR_PASSWORD', 'Editor@2026');

      if (sysRole && sysPassword) {
        const sysUser = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: sysEmail } });
        if (!sysUser) {
          await userService.add({
            username: 'sysadmin',
            email: sysEmail,
            password: sysPassword,
            confirmed: true,
            blocked: false,
            role: sysRole.id,
            provider: 'local',
          });
        }
      }
      if (edRole && edPassword) {
        const edUser = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: edEmail } });
        if (!edUser) {
          await userService.add({
            username: 'editor',
            email: edEmail,
            password: edPassword,
            confirmed: true,
            blocked: false,
            role: edRole.id,
            provider: 'local',
          });
        }
      }

      // ----------------------------------------------------------------------
      // 3. Seed SiteSetting (ข้อมูลเบื้องต้นบริษัท)
      // ----------------------------------------------------------------------
      const existingSiteSetting = await strapi.documents('api::site-setting.site-setting').findFirst();
      if (!existingSiteSetting) {
        await strapi.documents('api::site-setting.site-setting').create({
          data: {
            hero_badge: 'NEXT-GEN ENTERPRISE AI ARCHITECTURE',
            hero_title_th: 'ยกระดับองค์กรสู่อนาคต ด้วยสถาปัตยกรรม AI อัจฉริยะ',
            hero_title_en: 'Elevating Enterprises with Autonomous AI Architecture',
            hero_subtitle_th: 'ออกแบบและพัฒนาโซลูชันปัญญาประดิษฐ์ระดับองค์กร ผสานความแม่นยำของข้อมูล ความปลอดภัยสูงสุด และประสบการณ์ดิจิทัลที่ไร้รอยต่อ',
            hero_subtitle_en: 'Designing enterprise artificial intelligence solutions blending data precision, military-grade security, and seamless digital transformation.',
            company_name_th: 'บริษัท ไอเจนโก้ จำกัด',
            company_name_en: 'IGENCO Co., Ltd.',
            address_th: '89/35 อาคารจูเคี่ยวเล้ง ชั้น 3 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพมหานคร 10210',
            address_en: '89/35 Chu Kiao Leng Bldg., 3rd Fl., Vibhavadi Rangsit Rd., Sanambin, Don Mueang, Bangkok 10210',
            phone: '0-2523-3559, 0-2523-3560, 063-525-4850',
            email: 'sales@igenco.co.th',
            taxId: '0115553003741',
            officeHours_th: 'จันทร์ - ศุกร์ เวลา 08:30 - 17:30 น.',
            officeHours_en: 'Mon - Fri, 08:30 - 17:30',
          },
          status: 'published',
        });
      }

      // ----------------------------------------------------------------------
      // 4. Seed News Articles (ข่าวสารทั้งหมด 4 รายการ)
      // ----------------------------------------------------------------------
      const seedNews = [
        {
          title_th: 'IGENCO ผ่านการรับรองมาตรฐาน ISO/IEC 29110',
          title_en: 'IGENCO Achieves ISO/IEC 29110 International Certification',
          subtitle_th: 'กระบวนการด้านการบริหารโครงการและกระบวนการด้านการสร้างซอฟต์แวร์',
          subtitle_en: 'Project Management & Software Implementation Engineering Standards',
          body_th: 'มาตรฐาน ISO 29110 ช่วยในการปรับปรุงสมรรถนะองค์กร ทำให้มีการบริหารจัดการคุณภาพและบริการด้านซอฟต์แวร์ที่มีประสิทธิภาพและมีศักยภาพในการเติบโตทางธุรกิจขององค์กร อีกทั้งยังสร้างความน่าเชื่อถือ',
          body_en: 'The ISO/IEC 29110 standard enhances organizational performance, ensuring quality software services, high operational efficiency, and international credibility for all enterprise clients.',
          fullContent_th: 'บริษัท ไอเจนโก้ จำกัด ได้ผ่านการตรวจประเมินและได้รับการรับรองมาตรฐานสากล ISO/IEC 29110 ในส่วนของกระบวนการด้านการบริหารโครงการ (Project Management) และกระบวนการด้านการสร้างซอฟต์แวร์ (Software Implementation) โดยมาตรฐาน ISO 29110 ช่วยในการปรับปรุงสมรรถนะองค์กร ทำให้มีการบริหารจัดการคุณภาพและบริการด้านซอฟต์แวร์ที่มีประสิทธิภาพและมีศักยภาพในการเติบโตทางธุรกิจขององค์กร อีกทั้งยังสร้างความน่าเชื่อถือแก่คู่ค้าและหน่วยงานผู้รับบริการในระดับสากล',
          fullContent_en: 'IGENCO Co., Ltd. has successfully passed rigorous audits and achieved ISO/IEC 29110 international software engineering certification covering Project Management and Software Implementation. This standard validates our systematic engineering rigor, enterprise quality assurance, and proven capability in delivering mission-critical public and private software projects.',
          category: 'Enterprise Software' as const,
          tag: 'Enterprise Software',
          readTime: '1 min',
          date_th: '25 มกราคม 2560',
          date_en: 'January 25, 2017',
          imageUrl: '/images/news/iso29110.jpg',
          externalLink: 'https://igenco.co.th/index.php/th/content?view=article&id=37:i-serff-training-day-1&catid=8',
        },
        {
          title_th: 'IGENCO ครบรอบ 8 ปี — กิจกรรมเพื่อสังคม (CSR)',
          title_en: 'IGENCO 8th Anniversary — Corporate Social Responsibility (CSR)',
          subtitle_th: 'ร่วมบริจาคเงินสนับสนุนและสิ่งของเครื่องใช้ ณ สถานสงเคราะห์เด็กอ่อนปากเกร็ด',
          subtitle_en: 'Donation and community support at Pakkred Babies Home',
          body_th: 'วันที่ 21 มีนาคม 2561 ผู้บริหารและทีมงาน บริษัท ไอเจนโก้ จำกัด ร่วมกันจัดกิจกรรมบริจาคเงินสนับสนุนและสิ่งของเครื่องใช้จำเป็นให้กับน้องๆ ในสถานสงเคราะห์เด็กอ่อนปากเกร็ด ในวาระที่บริษัทฯ ได้เปิดมาครบ',
          body_en: 'On March 21, 2018, executives and staff from IGENCO Co., Ltd. organized a charitable donation of necessary supplies and financial support to children at Pakkred Babies Home in celebration of our 8th corporate anniversary.',
          fullContent_th: 'วันที่ 21 มีนาคม 2561 ผู้บริหารและทีมงาน บริษัท ไอเจนโก้ จำกัด ร่วมกันจัดกิจกรรมบริจาคเงินสนับสนุนและสิ่งของเครื่องใช้จำเป็นให้กับน้องๆ ในสถานสงเคราะห์เด็กอ่อนปากเกร็ด ในวาระที่บริษัทฯ ได้เปิดมาครบ 8 ปี เพื่อส่งเสริมและร่วมเป็นส่วนหนึ่งในการตอบแทนสังคมอย่างยั่งยืน',
          fullContent_en: 'On March 21, 2018, the executive team and employees of IGENCO Co., Ltd. united to host a CSR initiative providing essential goods and donations to the Pakkred Babies Home, marking 8 years of corporate growth and sustainable community support.',
          category: 'Service Development' as const,
          tag: 'Service Development',
          readTime: '1 min',
          date_th: '21 มีนาคม 2561',
          date_en: 'March 21, 2018',
          imageUrl: '/images/news/csr8years.jpg',
          externalLink: 'https://igenco.co.th/index.php/th/content?view=article&id=70:erp&catid=8',
        },
        {
          title_th: 'I-SERFF Training Day — อบรมระบบยื่นแบบ คปภ.',
          title_en: 'I-SERFF Training Day — OIC Regulatory Filing Workshop',
          subtitle_th: 'ความร่วมมือกับสำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.)',
          subtitle_en: 'Strategic collaboration with the Office of Insurance Commission (OIC)',
          body_th: 'ภาพกิจกรรมการจัดอบรมหลักสูตรสำหรับผู้ใช้งานตัวแทนบริษัทประกันภัย สำหรับการใช้งานระบบ I-SERFF โดยความร่วมมือจากสำนักงานคณะกรรมการกำกับและส่งเสริมการ...',
          body_en: 'Highlights from the official certification workshop for insurance company representatives using the I-SERFF system, held in close collaboration with the Office of Insurance Commission.',
          fullContent_th: 'บริษัท ไอเจนโก้ จำกัด ร่วมกับสำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.) จัดการอบรมเชิงปฏิบัติการให้แก่ตัวแทนและเจ้าหน้าที่จากบริษัทประกันภัยชั้นนำ เพื่อเตรียมความพร้อมในการใช้งานระบบยื่นแบบและขอรับความเห็นชอบอัตราเบี้ยประกันภัยทางอิเล็กทรอนิกส์ (I-SERFF) ช่วยเพิ่มความสะดวกรวดเร็ว ความโปร่งใส และลดขั้นตอนเอกสารลงอย่างมีนัยสำคัญ',
          fullContent_en: 'IGENCO Co., Ltd., in partnership with the Office of Insurance Commission (OIC), hosted a comprehensive hands-on training workshop for underwriters and officers from top insurance enterprises across Thailand, ensuring streamlined electronic filing and rapid regulatory approval under the I-SERFF platform.',
          category: 'Enterprise Software' as const,
          tag: 'Enterprise Software',
          readTime: '1 min',
          date_th: '27 กุมภาพันธ์ 2558',
          date_en: 'February 27, 2015',
          imageUrl: '/images/news/iserff.jpg',
          externalLink: 'https://igenco.co.th/index.php/th/content?view=article&id=35:i-serff-training-day&catid=8',
        },
        {
          title_th: 'การประชุมชี้แจงการใช้งานระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ (EFMS)',
          title_en: 'EFMS Electronic Filing Management System Orientation',
          subtitle_th: 'โครงการพัฒนาระบบเชื่อมต่อข้อมูลระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงิน',
          subtitle_en: 'Data integration gateway between Deposit Protection Agency and financial institutions',
          body_th: 'สถาบันคุ้มครองเงินฝาก (สคฝ.) จัดการประชุมชี้แจงการใช้งานระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงิน (EFMS) ให้กับเจ้าหน้าที่...',
          body_en: 'The Deposit Protection Agency (DPA) organized a technical briefing session for bank executives and IT officers on deploying the Electronic Filing Management System (EFMS).',
          fullContent_th: 'ทีมวิศวกรผู้พัฒนาของไอเจนโก้ ได้เข้าร่วมการประชุมชี้แจงและถ่ายทอดการใช้งานระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ (Electronic Filing Management System: EFMS) ร่วมกับสถาบันคุ้มครองเงินฝาก (สคฝ.) และผู้แทนจากสถาบันการเงิน เพื่อสร้างมาตรฐานความปลอดภัยในการรับส่งข้อมูลทางการเงินที่มีความสำคัญสูง พร้อมระบบตรวจสอบความถูกต้องอัตโนมัติแบบเรียลไทม์',
          fullContent_en: 'IGENCO software architects participated in the orientation and technical handover of the Electronic Filing Management System (EFMS) alongside the Deposit Protection Agency and delegates from commercial banks, securing financial-grade electronic data interchanges with real-time validation.',
          category: 'E-Commerce' as const,
          tag: 'E-Commerce',
          readTime: '1 min',
          date_th: 'โครงการระบบข้อมูล สคฝ.',
          date_en: 'DPA System Initiative',
          imageUrl: '/images/news/smartflow.png',
          externalLink: 'https://igenco.co.th/index.php/th/content',
        },
      ];

      for (const n of seedNews) {
        const exists = await strapi.db
          .query('api::news-article.news-article')
          .findOne({ where: { title_th: n.title_th } });
        if (!exists) {
          await strapi.documents('api::news-article.news-article').create({
            data: n,
            status: 'published',
          });
        }
      }

      // ----------------------------------------------------------------------
      // 5. Seed Products & Solutions (12 โซลูชัน + 5 ไฮไลต์)
      // ----------------------------------------------------------------------
      const seedProducts = [
        {
          title: 'i-SMARTFLOW',
          subtitle_th: 'โปรแกรมระบบบริหารสำนักงานอัตโนมัติ (e-Office)',
          subtitle_en: 'Enterprise e-Office & Workflow Automation',
          description_th: 'ระบบสารบรรณอิเล็กทรอนิกส์และสายอนุมัติเอกสารอัตโนมัติ ลดการใช้กระดาษ ติดตามสถานะเอกสารแบบเรียลไทม์ รองรับการลงนามดิจิทัล',
          description_en: 'Electronic document lifecycle management with dynamic approval flows, digital signatures, and real-time tracking.',
          tag: 'e-Office & Workflow',
          tags: ['e-Saraban', 'Paperless', 'Digital Sign'],
          features_th: [
            'รับ-ส่งหนังสือราชการ เกษียณหนังสือ และลงนามดิจิทัลถูกต้องตามกฎหมาย',
            'กำหนดสายการอนุมัติ (Approval Workflow) ได้ยืดหยุ่นตามโครงสร้างหน่วยงาน',
            'ระบบสืบค้นเอกสารอัจฉริยะแบบ OCR และ Full-Text Search',
          ],
          features_en: [
            'Electronic memo receipt, dispatch, minute endorsement, and digital signature',
            'Customizable multi-tier approval routing for complex organizations',
            'High-speed OCR and full-text document search',
          ],
          isFeatured: true,
          featuredOrder: 2,
          awardBadge: '⭐ ISO/IEC 29110 Certified',
          imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
          iconType: 'document-pen',
        },
        {
          title: 'HR.ai (i-Huris)',
          subtitle_th: 'ระบบบริหารทรัพยากรมนุษย์และเงินเดือนครบวงจร',
          subtitle_en: 'Comprehensive Human Capital & Payroll Suite',
          description_th: 'ซอฟต์แวร์บริหารงานบุคคลรางวัลชนะเลิศ The Winner OIIO ครอบคลุมการลงเวลา คำนวณเงินเดือน ภาษี สวัสดิการ และประเมินผล KPI',
          description_en: 'Award-winning OIIO human resource software covering mobile attendance, payroll, tax, benefits, and KPI evaluation.',
          tag: 'HR & Payroll Cloud',
          tags: ['Payroll', 'Mobile Time', 'OIIO Winner'],
          features_th: [
            'ลงเวลางานผ่านมือถือพร้อมตรวจจับใบหน้าและพิกัด GPS',
            'คำนวณเงินเดือน ภาษี ประกันสังคมอัตโนมัติ ถูกต้องตามกฎหมาย 100%',
            'ระบบพอร์ทัลพนักงาน ESS และหัวหน้างาน MSS ออนไลน์',
          ],
          features_en: [
            'Mobile GPS & facial recognition attendance tracking',
            '100% automated payroll, tax, and social security processing',
            'Employee Self-Service (ESS) and Manager Portals (MSS)',
          ],
          isFeatured: true,
          featuredOrder: 1,
          awardBadge: '🏆 The Winner OIIO',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
          iconType: 'users',
        },
        {
          title: 'i-FINSOFT — ERP',
          subtitle_th: 'ระบบบริหารบัญชี การเงิน และทรัพยากรองค์กร',
          subtitle_en: 'Financial Accounting & Enterprise Planning',
          description_th: 'ระบบบัญชีและการเงินมาตรฐานครบวงจร เชื่อมโยงข้อมูลบัญชีแยกประเภท เจ้าหนี้ ลูกหนี้ งบประมาณ และออกงบการเงินได้อย่างแม่นยำ',
          description_en: 'Standardized accounting and finance management linking GL, AR, AP, budgeting, and precision financial statements.',
          tag: 'Accounting & ERP',
          tags: ['General Ledger', 'Budgeting', 'Financial Report'],
          features_th: [
            'เชื่อมโยงข้อมูลผังบัญชี ลูกหนี้ เจ้าหนี้ และระบบจัดซื้อครบวงจร',
            'บริหารงบประมาณและออกงบการเงินแบบเรียลไทม์',
            'ผ่านการรับรองมาตรฐานซอฟต์แวร์วิศวกรรม ISO/IEC 29110',
          ],
          features_en: [
            'Unified chart of accounts, AR, AP, and procurement integration',
            'Real-time budget control and automated financial reporting',
            'Certified under ISO/IEC 29110 software engineering standards',
          ],
          isFeatured: true,
          featuredOrder: 4,
          awardBadge: '💼 Enterprise Solution',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
          iconType: 'pie-chart',
        },
        {
          title: 'iGenco BSC',
          subtitle_th: 'ระบบประเมินและวัดผลการปฏิบัติงานองค์กร',
          subtitle_en: 'Enterprise Performance & KPI Measurement',
          description_th: 'ระบบบริหารจัดการตัวชี้วัด (KPI) ตามแนวคิด Balanced Scorecard เชื่อมโยงเป้าหมายระดับองค์กรสู่ระดับฝ่ายและรายบุคคลอย่างเป็นรูปธรรม',
          description_en: 'Balanced Scorecard and KPI performance tracking aligning strategic corporate objectives with department and employee goals.',
          tag: 'KPI & Balanced Scorecard',
          tags: ['KPI Tracking', 'Scorecard', 'Performance'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'target',
        },
        {
          title: 'i-Regist',
          subtitle_th: 'ระบบลงทะเบียนที่ตอบโจทย์ทุกการลงทะเบียน',
          subtitle_en: 'Smart Event & Seminar Registration Platform',
          description_th: 'แพลตฟอร์มบริหารจัดการการลงทะเบียนงานสัมมนา อีเวนต์ และการอบรม รองรับการออก QR Code เช็กอินหน้างาน และออกใบประกาศฯ',
          description_en: 'Event, training, and conference registration platform with automated QR Code on-site check-in and e-Certificate generation.',
          tag: 'Smart Registration',
          tags: ['QR Check-in', 'Event Badge', 'Certificate'],
          features_th: [
            'ระบบจองและออก QR Code เช็กอินเข้าร่วมงานสะดวกรวดเร็ว',
            'ระบบจัดคิวอัจฉริยะ iGenQ คำนวณเวลารอคอยแบบเรียลไทม์',
            'ออกใบประกาศนียบัตรออนไลน์และสรุปสถิติผู้เข้าร่วมงาน',
          ],
          features_en: [
            'Instant online booking and QR Code digital badge check-in',
            'iGenQ intelligent queuing with real-time wait estimation',
            'Automated e-Certificates and live attendee analytics',
          ],
          isFeatured: true,
          featuredOrder: 5,
          awardBadge: '🎫 Event & Service Tech',
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
          iconType: 'badge-id',
        },
        {
          title: 'i-EDUCATION',
          subtitle_th: 'ระบบบริหารจัดการด้านการศึกษาและสถานศึกษา',
          subtitle_en: 'Academic & Institutional Management System',
          description_th: 'ระบบสารสนเทศสำหรับสถาบันการศึกษา ครอบคลุมประวัตินักศึกษา การลงทะเบียนเรียน ตารางสอน การวัดผล และระบบเกรดออนไลน์',
          description_en: 'Campus information system covering student records, course registration, scheduling, assessment, and online grading.',
          tag: 'Academic Management',
          tags: ['Student Portal', 'Grading System', 'Course Registration'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'graduation',
        },
        {
          title: 'i-Real Estate',
          subtitle_th: 'ระบบบริหารการขายและจองโครงการอสังหาริมทรัพย์',
          subtitle_en: 'Property Sales & Booking Management',
          description_th: 'ระบบบริหารการขายสำหรับโครงการคอนโดมิเนียมและบ้านจัดสรร แสดงผังห้องว่างแบบเรียลไทม์ คำนวณค่างวด สัญญาจอง และโอนกรรมสิทธิ์',
          description_en: 'Sales and unit reservation management for condominiums and residential projects with real-time floor plans and installment calculators.',
          tag: 'Property & Condo CRM',
          tags: ['Unit Layout', 'Booking & Contract', 'Installment'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'building',
        },
        {
          title: 'iPOS',
          subtitle_th: 'ระบบบริหารการขายหน้าร้านและคลังสินค้าอัจฉริยะ',
          subtitle_en: 'Smart Retail POS & Inventory Management',
          description_th: 'ระบบขายหน้าร้าน (Point of Sale) ที่ใช้งานง่าย รองรับการสแกนบาร์โค้ด จัดโปรโมชัน ตัดสต็อกสินค้าอัตโนมัติ และดูยอดขายได้ทุกสาขา',
          description_en: 'User-friendly Point of Sale system with barcode scanning, automated stock deduction, promotional tools, and multi-branch sales analytics.',
          tag: 'Point of Sale & Stock',
          tags: ['Barcode Scan', 'Multi-Branch', 'Stock Alert'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'cash-register',
        },
        {
          title: 'iMme Application',
          subtitle_th: 'แอปพลิเคชันบันทึกงานแต่งงานและจัดการแขกผู้ร่วมงาน',
          subtitle_en: 'Wedding & Guest Experience Application',
          description_th: 'แพลตฟอร์มดิจิทัลสำหรับคู่บ่าวสาวและออแกไนเซอร์ ช่วยบันทึกของขวัญ ซองร่วมแสดงความยินดี รายชื่อแขก และจัดการงบประมาณงานแต่ง',
          description_en: 'Digital platform for couples and wedding organizers to manage guest lists, monetary blessings, gift registries, and budget plans.',
          tag: 'Wedding & Event App',
          tags: ['Gift Registry', 'Guest List', 'Mobile App'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'heart',
        },
        {
          title: 'i-SMARTSOFT',
          subtitle_th: 'ชุดซอฟต์แวร์บริหารงานเอกสารและติดตามงานองค์กร',
          subtitle_en: 'Document Management & Workflow Tracking',
          description_th: 'โซลูชันจัดการเอกสารดิจิทัล จัดเก็บไฟล์อย่างเป็นหมวดหมู่ กำหนดสิทธิ์การเข้าถึง และติดตามความคืบหน้าของงานในแต่ละแผนก',
          description_en: 'Digital document repository with category indexing, role-based access permissions, and departmental task tracking.',
          tag: 'Document & Case Tracking',
          tags: ['Document Mgmt', 'Permission Control', 'Task Tracking'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'document-case',
        },
        {
          title: 'Software OnDemand',
          subtitle_th: 'บริการออกแบบและพัฒนาซอฟต์แวร์ตามความต้องการเฉพาะ',
          subtitle_en: 'Tailored Software Design & Development',
          description_th: 'บริการพัฒนาเว็บแอปพลิเคชัน โมบายแอปพลิเคชัน และเชื่อมต่อ API ตามกระบวนการธุรกิจเฉพาะขององค์กร ภายใต้มาตรฐาน ISO/IEC 29110',
          description_en: 'Custom web and mobile application engineering, system integrations, and API workflows certified under ISO/IEC 29110.',
          tag: 'Custom Development',
          tags: ['Custom Web/App', 'API Integration', 'ISO 29110'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'code',
        },
        {
          title: 'OutSource Service',
          subtitle_th: 'บริการจัดหาบุคลากรผู้เชี่ยวชาญด้านเทคโนโลยีสารสนเทศ',
          subtitle_en: 'IT Talent Outsourcing & Professional Staffing',
          description_th: 'บริการจัดส่งทีมนักวิเคราะห์ระบบ (SA) โปรแกรมเมอร์ (Developer) และผู้ดูแลระบบมืออาชีพ เพื่อขับเคลื่อนโครงการไอทีขององค์กร',
          description_en: 'Dedicated IT staffing including System Analysts (SA), Developers, and System Administrators to drive enterprise projects.',
          tag: 'IT Professional Team',
          tags: ['Dedicated Team', 'SA & Developer', 'Enterprise SLA'],
          isFeatured: false,
          featuredOrder: 0,
          iconType: 'user-tech',
        },
      ];

      for (const p of seedProducts) {
        const exists = await strapi.db
          .query('api::product.product')
          .findOne({ where: { title: p.title } });
        if (!exists) {
          await strapi.documents('api::product.product').create({
            data: p,
            status: 'published',
          });
        }
      }

      // ----------------------------------------------------------------------
      // 6. Seed Client Partners (ลูกค้าและพันธมิตร 9 รายการ)
      // ----------------------------------------------------------------------
      const seedClients = [
        {
          categoryKey: 'gov' as const,
          categoryName_th: 'ภาครัฐและกำกับดูแล',
          categoryName_en: 'Government & Regulators',
          title_th: 'สำนักงาน คปภ. (OIC)',
          title_en: 'Office of Insurance Commission (OIC)',
          subtitle_th: 'ระบบยื่นแบบกรมธรรม์ I-SERFF',
          subtitle_en: 'I-SERFF Insurance Filing System',
          description_th: 'ระบบยื่นขอรับความเห็นชอบแบบและข้อความกรมธรรม์ประกันภัยทางอิเล็กทรอนิกส์ เชื่อมโยงภาคธุรกิจประกันภัยทั่วประเทศ',
          description_en: 'Nationwide electronic policy filing and regulatory compliance submission gateway connecting all Thai insurance carriers.',
          solution_th: 'I-SERFF Enterprise',
          solution_en: 'I-SERFF Enterprise Gateway',
          stats_th: '100% ครอบคลุมธุรกิจประกันภัยทั่วประเทศ',
          stats_en: '100% Nationwide Insurance Coverage',
          iconType: 'shield',
          accentColor: '#00C978',
        },
        {
          categoryKey: 'gov' as const,
          categoryName_th: 'ภาครัฐและกำกับดูแล',
          categoryName_en: 'Government & Regulators',
          title_th: 'สถาบันคุ้มครองเงินฝาก (สคฝ.)',
          title_en: 'Deposit Protection Agency (DPA)',
          subtitle_th: 'ระบบเชื่อมต่อข้อมูล EFMS',
          subtitle_en: 'EFMS Electronic Data Exchange',
          description_th: 'ระบบรับและจัดเก็บข้อมูลอิเล็กทรอนิกส์ระหว่างสถาบันคุ้มครองเงินฝากและสถาบันการเงินสมาชิกทั่วประเทศ',
          description_en: 'Secure electronic data filing and reconciliation infrastructure between the Deposit Protection Agency and member financial institutions.',
          solution_th: 'Electronic Financial Management Gateway',
          solution_en: 'Electronic Financial Management Gateway',
          stats_th: 'เชื่อมโยงสถาบันการเงินสมาชิกทั่วประเทศ',
          stats_en: 'Connecting all commercial bank members',
          iconType: 'bank',
          accentColor: '#0284C7',
        },
        {
          categoryKey: 'private' as const,
          categoryName_th: 'ภาคเอกชนและประกันภัย',
          categoryName_en: 'Private Sector & Insurance',
          title_th: 'กลุ่มบริษัทประกันภัยชั้นนำ',
          title_en: 'Leading Insurance Groups',
          subtitle_th: 'ผู้ใช้งานระบบ I-SERFF & HR.ai',
          subtitle_en: 'Users of I-SERFF & HR.ai',
          description_th: 'ติดตั้งระบบเชื่อมต่อข้อมูล I-SERFF ภายในองค์กรและระบบบริหารทรัพยากรบุคคล HR.ai สำหรับธุรกิจประกันภัย',
          description_en: 'Implemented automated I-SERFF data connectors and smart HR.ai human capital management for insurance enterprises.',
          solution_th: 'I-SERFF Connector & HR.ai Platform',
          solution_en: 'I-SERFF Connector & HR.ai Platform',
          stats_th: 'ลดระยะเวลาประมวลผลเอกสารกว่า 70%',
          stats_en: '70% reduction in paper processing time',
          iconType: 'briefcase',
          accentColor: '#8B5CF6',
        },
        {
          categoryKey: 'tech' as const,
          categoryName_th: 'พันธมิตรเทคโนโลยี',
          categoryName_en: 'Technology Partners',
          title_th: 'TÜV NORD Thailand',
          title_en: 'TÜV NORD Thailand',
          subtitle_th: 'ISO/IEC 29110 Certified',
          subtitle_en: 'ISO/IEC 29110 Certified',
          description_th: 'รับรองมาตรฐานวิศวกรรมซอฟต์แวร์ระดับสากล ISO/IEC 29110:2011 ครอบคลุมกระบวนการบริหารโครงการและการพัฒนาซอฟต์แวร์',
          description_en: 'Certified under international software engineering standard ISO/IEC 29110:2011 covering project management and software implementation.',
          solution_th: 'Software Engineering Assurance',
          solution_en: 'Software Engineering Assurance',
          stats_th: 'มาตรฐานระดับสากล ISO/IEC 29110',
          stats_en: 'International ISO/IEC 29110 Standard',
          iconType: 'cert',
          accentColor: '#059669',
        },
        {
          categoryKey: 'tech' as const,
          categoryName_th: 'พันธมิตรเทคโนโลยี',
          categoryName_en: 'Technology Partners',
          title_th: 'depa Thailand',
          title_en: 'depa Thailand',
          subtitle_th: 'Digital Ecosystem Partner',
          subtitle_en: 'Digital Ecosystem Partner',
          description_th: 'ร่วมขับเคลื่อนมาตรฐานอุตสาหกรรมซอฟต์แวร์ไทยและยกระดับผู้ประกอบการสู่ยุคเศรษฐกิจดิจิทัล',
          description_en: 'Partnering to advance Thai software industry standards and accelerate enterprise digital transformation in the digital economy.',
          solution_th: 'Digital Economy Promotion Partnership',
          solution_en: 'Digital Economy Promotion Partnership',
          stats_th: 'เครือข่ายพันธมิตรระบบนิเวศดิจิทัล',
          stats_en: 'Digital Ecosystem Network Partner',
          iconType: 'globe',
          accentColor: '#2563EB',
        },
        {
          categoryKey: 'tech' as const,
          categoryName_th: 'พันธมิตรเทคโนโลยี',
          categoryName_en: 'Technology Partners',
          title_th: 'NVIDIA AI Inception',
          title_en: 'NVIDIA AI Inception',
          subtitle_th: 'AI Computing Partner',
          subtitle_en: 'AI Computing Partner',
          description_th: 'โครงสร้างพื้นฐานการประมวลผล AI ประสิทธิภาพสูง สำหรับโซลูชัน Enterprise AI และระบบวิเคราะห์ข้อมูลอัจฉริยะ',
          description_en: 'High-performance AI compute infrastructure powering Enterprise AI models and autonomous analytics pipelines.',
          solution_th: 'GPU Accelerated AI Compute',
          solution_en: 'GPU Accelerated AI Compute',
          stats_th: 'โครงสร้างพื้นฐาน AI ความเร็วสูง',
          stats_en: 'High-Throughput Enterprise AI',
          iconType: 'chip',
          accentColor: '#16A34A',
        },
        {
          categoryKey: 'tech' as const,
          categoryName_th: 'พันธมิตรเทคโนโลยี',
          categoryName_en: 'Technology Partners',
          title_th: 'AWS & Oracle Cloud',
          title_en: 'AWS & Oracle Cloud',
          subtitle_th: 'Cloud & Enterprise Database',
          subtitle_en: 'Cloud & Enterprise Database',
          description_th: 'สถาปัตยกรรมคลาวด์และฐานข้อมูลระดับองค์กรที่มีเสถียรภาพและความปลอดภัยสูงสุดสำหรับระบบงานสำคัญ',
          description_en: 'Mission-critical enterprise cloud architecture and database hosting ensuring high security and resilient uptime.',
          solution_th: 'Enterprise Cloud Architecture',
          solution_en: 'Enterprise Cloud Architecture',
          stats_th: 'Uptime 99.99% Enterprise Grade',
          stats_en: '99.99% Enterprise Uptime',
          iconType: 'cloud',
          accentColor: '#F97316',
        },
        {
          categoryKey: 'private' as const,
          categoryName_th: 'ภาคเอกชนและประกันภัย',
          categoryName_en: 'Private Sector & Insurance',
          title_th: 'องค์กรเอกชนและโรงพยาบาล',
          title_en: 'Private Enterprises & Hospitals',
          subtitle_th: 'ผู้ใช้งานระบบ iSmartFlow & iGenQ',
          subtitle_en: 'Users of iSmartFlow & iGenQ',
          description_th: 'ยกระดับการให้บริการจุดต้อนรับด้วยระบบคิวอัจฉริยะ iGenQ และลดการใช้กระดาษด้วยระบบสำนักงานอิเล็กทรอนิกส์ iSmartFlow',
          description_en: 'Elevated reception workflows with iGenQ Smart Queuing and reduced paper usage with iSmartFlow electronic document management.',
          solution_th: 'iSmartFlow & iGenQ Queuing System',
          solution_en: 'iSmartFlow & iGenQ Queuing System',
          stats_th: 'ลดเวลารอคอยเฉลี่ยของผู้รับบริการ 40%',
          stats_en: '40% reduction in average wait times',
          iconType: 'hospital',
          accentColor: '#E11D48',
        },
        {
          categoryKey: 'gov' as const,
          categoryName_th: 'ภาครัฐและกำกับดูแล',
          categoryName_en: 'Government & Regulators',
          title_th: 'หน่วยงานรัฐวิสาหกิจ',
          title_en: 'State-Owned Enterprises',
          subtitle_th: 'ระบบบริหารงานบุคคลและ ERP',
          subtitle_en: 'HR Management & Enterprise ERP',
          description_th: 'วางระบบสารสนเทศบริหารทรัพยากรองค์กร เชื่อมโยงข้อมูลระหว่างหน่วยงาน และจัดทำคลังข้อมูลกลาง (Data Lake)',
          description_en: 'Enterprise resource planning and human capital management linking cross-departmental operations and central Data Lake.',
          solution_th: 'ERP & Centralized Enterprise Data Lake',
          solution_en: 'ERP & Centralized Enterprise Data Lake',
          stats_th: 'รองรับผู้ใช้งานขนาดใหญ่กว่า 10,000 คน',
          stats_en: 'Supporting 10,000+ enterprise users',
          iconType: 'enterprise',
          accentColor: '#0D9488',
        },
      ];

      for (const c of seedClients) {
        const exists = await strapi.db
          .query('api::client-partner.client-partner')
          .findOne({ where: { title_th: c.title_th } });
        if (!exists) {
          await strapi.documents('api::client-partner.client-partner').create({
            data: c,
            status: 'published',
          });
        }
      }

      // ----------------------------------------------------------------------
      // 7. ตั้งค่าป้ายชื่อฟิลด์ภาษาไทย (Friendly Labels) และคอลัมน์ใน Content Manager
      //    เพื่อให้ Editor เข้ามาอัปเดตข่าวสารและข้อมูลเบื้องต้นได้ง่ายและถูกส่วน
      // ----------------------------------------------------------------------
      const friendlyConfigs: Record<string, {
        mainField?: string;
        listColumns?: string[];
        labels: Record<string, { label: string; description?: string }>;
      }> = {
        'api::site-setting.site-setting': {
          labels: {
            hero_badge: { label: 'ป้ายข้อความบนสุดหน้าแรก (Eyebrow)', description: 'แสดงเหนือหัวข้อใหญ่หน้าแรก' },
            hero_title_th: { label: 'พาดหัวใหญ่หน้าแรก (ภาษาไทย)', description: 'ข้อความต้อนรับหลักหน้าแรก' },
            hero_title_en: { label: 'พาดหัวใหญ่หน้าแรก (English)' },
            hero_subtitle_th: { label: 'คำอธิบายใต้พาดหัวหน้าแรก (ภาษาไทย)' },
            hero_subtitle_en: { label: 'คำอธิบายใต้พาดหัวหน้าแรก (English)' },
            company_name_th: { label: 'ชื่อบริษัท (ภาษาไทย)' },
            company_name_en: { label: 'ชื่อบริษัท (English)' },
            address_th: { label: 'ที่อยู่สำนักงานใหญ่ (ภาษาไทย)' },
            address_en: { label: 'ที่อยู่สำนักงานใหญ่ (English)' },
            phone: { label: 'เบอร์โทรศัพท์ติดต่อ' },
            email: { label: 'อีเมลติดต่อหลัก' },
            taxId: { label: 'เลขประจำตัวผู้เสียภาษี' },
            officeHours_th: { label: 'เวลาทำการ (ภาษาไทย)' },
            officeHours_en: { label: 'เวลาทำการ (English)' },
          },
        },
        'api::news-article.news-article': {
          mainField: 'title_th',
          listColumns: ['id', 'title_th', 'category', 'date_th', 'updatedAt'],
          labels: {
            title_th: { label: 'หัวข้อข่าว (ภาษาไทย)' },
            title_en: { label: 'หัวข้อข่าว (English)' },
            subtitle_th: { label: 'หัวข้อย่อย / สรุปสั้น (ภาษาไทย)' },
            subtitle_en: { label: 'หัวข้อย่อย / สรุปสั้น (English)' },
            body_th: { label: 'เนื้อหาย่อ — แสดงบนการ์ดหน้าเว็บ (ภาษาไทย)' },
            body_en: { label: 'เนื้อหาย่อ — แสดงบนการ์ดหน้าเว็บ (English)' },
            fullContent_th: { label: 'เนื้อหาฉบับเต็ม — แสดงเมื่อกดอ่านเพิ่มเติม (ไทย)' },
            fullContent_en: { label: 'เนื้อหาฉบับเต็ม — แสดงเมื่อกดอ่านเพิ่มเติม (English)' },
            category: { label: 'หมวดหมู่ข่าว' },
            tag: { label: 'ป้ายแท็กมุมรูปภาพ' },
            readTime: { label: 'เวลาในการอ่าน (เช่น 1 min)' },
            date_th: { label: 'วันที่แสดงบนข่าว (ภาษาไทย)' },
            date_en: { label: 'วันที่แสดงบนข่าว (English)' },
            image: { label: 'อัปโหลดรูปภาพหน้าปกข่าว (แนะนำ 16:9)' },
            imageUrl: { label: 'ลิงก์รูปภาพ (กรณีไม่ใช้อัปโหลด)' },
            externalLink: { label: 'ลิงก์อ่านข่าวภายนอก (ถ้ามี)' },
          },
        },
        'api::product.product': {
          mainField: 'title',
          listColumns: ['id', 'title', 'tag', 'isFeatured', 'featuredOrder'],
          labels: {
            title: { label: 'ชื่อผลิตภัณฑ์ / ระบบ' },
            slug: { label: 'รหัสอ้างอิง URL (Slug)' },
            subtitle_th: { label: 'คำโปรยสีเขียวใต้ชื่อ (ภาษาไทย)' },
            subtitle_en: { label: 'คำโปรยใต้ชื่อ (English)' },
            description_th: { label: 'คำอธิบายผลิตภัณฑ์ (ภาษาไทย)' },
            description_en: { label: 'คำอธิบายผลิตภัณฑ์ (English)' },
            tag: { label: 'ป้ายหมวดหมู่มุมบนขวา' },
            tags: { label: 'แท็กจุดเด่น 3 รายการ (JSON Array)' },
            features_th: { label: 'จุดเด่น / ฟีเจอร์ (ภาษาไทย - JSON)' },
            features_en: { label: 'จุดเด่น / ฟีเจอร์ (English - JSON)' },
            isFeatured: { label: 'แสดงในสไลด์ไฮไลต์ด้านบน?' },
            featuredOrder: { label: 'ลำดับในสไลด์ไฮไลต์ (1-5)' },
            awardBadge: { label: 'ป้ายรางวัล / มาตรฐาน' },
            image: { label: 'อัปโหลดรูปภาพสไลด์' },
            imageUrl: { label: 'ลิงก์รูปภาพ (กรณีไม่ใช้อัปโหลด)' },
            iconType: { label: 'ชนิดไอคอนประจำระบบ' },
          },
        },
        'api::client-partner.client-partner': {
          mainField: 'title_th',
          listColumns: ['id', 'title_th', 'categoryKey', 'solution_th'],
          labels: {
            categoryKey: { label: 'กลุ่มประเภท (gov=ภาครัฐ, private=เอกชน, tech=พันธมิตร)' },
            categoryName_th: { label: 'ชื่อกลุ่ม (ภาษาไทย)' },
            categoryName_en: { label: 'ชื่อกลุ่ม (English)' },
            title_th: { label: 'ชื่อองค์กร / ลูกค้า (ภาษาไทย)' },
            title_en: { label: 'ชื่อองค์กร / ลูกค้า (English)' },
            subtitle_th: { label: 'ระบบที่ใช้งาน (ภาษาไทย)' },
            subtitle_en: { label: 'ระบบที่ใช้งาน (English)' },
            description_th: { label: 'รายละเอียดความร่วมมือ (ภาษาไทย)' },
            description_en: { label: 'รายละเอียดความร่วมมือ (English)' },
            solution_th: { label: 'ชื่อโซลูชันที่ติดตั้ง (ไทย)' },
            solution_en: { label: 'ชื่อโซลูชันที่ติดตั้ง (English)' },
            stats_th: { label: 'ตัวเลขความสำเร็จ (ไทย)' },
            stats_en: { label: 'ตัวเลขความสำเร็จ (English)' },
          },
        },
        'api::contact-inquiry.contact-inquiry': {
          mainField: 'contactName',
          listColumns: ['id', 'contactName', 'organization', 'interestedProduct', 'status', 'createdAt'],
          labels: {
            contactName: { label: 'ชื่อผู้ติดต่อ' },
            organization: { label: 'บริษัท / หน่วยงาน' },
            phone: { label: 'เบอร์โทรศัพท์' },
            email: { label: 'อีเมล' },
            subject: { label: 'หัวข้อที่ติดต่อ' },
            interestedProduct: { label: 'ผลิตภัณฑ์ที่สนใจ' },
            details: { label: 'รายละเอียดเพิ่มเติม' },
            status: { label: 'สถานะการติดตาม (new / contacted / closed)' },
          },
        },
      };

      for (const [uid, cfg] of Object.entries(friendlyConfigs)) {
        const key = `plugin_content_manager_configuration_content_types::${uid}`;
        const row = await strapi.db.query('strapi::core-store').findOne({ where: { key } });
        if (row?.value) {
          const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
          if (cfg.mainField) {
            parsed.settings = { ...parsed.settings, mainField: cfg.mainField };
          }
          if (cfg.listColumns && parsed.layouts) {
            parsed.layouts.list = cfg.listColumns;
          }
          if (parsed.metadatas) {
            for (const [field, meta] of Object.entries(cfg.labels)) {
              if (parsed.metadatas[field]) {
                if (parsed.metadatas[field].edit) {
                  parsed.metadatas[field].edit.label = meta.label;
                  if (meta.description) {
                    parsed.metadatas[field].edit.description = meta.description;
                  }
                }
                if (parsed.metadatas[field].list) {
                  parsed.metadatas[field].list.label = meta.label;
                }
              }
            }
          }
          await strapi.db.query('strapi::core-store').update({
            where: { id: row.id },
            data: { value: JSON.stringify(parsed) },
          });
        }
      }

      strapi.log.info('✅ IGENCO Bootstrap: Friendly Thai Admin Menus, Labels, Permissions, and Seed Data ready!');
    } catch (err) {
      strapi.log.error('❌ IGENCO Bootstrap Error:', err);
    }
  },
};
