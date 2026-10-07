import { ProjectModel } from '@/models/Project';
import { SkillModel } from '@/models/Skill';
import { ExperienceModel } from '@/models/Experience';
import { SettingModel } from '@/models/Setting';
import { AdminAuthModel } from '@/models/AdminAuth';
import { hashPassword } from '@/lib/auth';
import {
  FALLBACK_PROJECTS,
  FALLBACK_SKILLS_DATA,
  FALLBACK_EXPERIENCES,
  FALLBACK_SETTINGS,
} from './fallback-data';

export {
  FALLBACK_PROJECTS as DEFAULT_PROJECTS,
  FALLBACK_SKILLS_DATA as DEFAULT_SKILLS_DATA,
  FALLBACK_EXPERIENCES as DEFAULT_EXPERIENCES_DATA,
};

export async function ensureDatabaseSeeded() {
  try {
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      console.log('Database empty: Auto-seeding 16 projects...');
      await ProjectModel.insertMany(FALLBACK_PROJECTS);
    }

    const skillCount = await SkillModel.countDocuments();
    if (skillCount === 0) {
      await SkillModel.insertMany(FALLBACK_SKILLS_DATA);
    }

    const expCount = await ExperienceModel.countDocuments();
    if (expCount === 0) {
      await ExperienceModel.insertMany(FALLBACK_EXPERIENCES);
    }

    const settingCount = await SettingModel.countDocuments();
    if (settingCount === 0) {
      await SettingModel.create({
        key: 'global_settings',
        ...FALLBACK_SETTINGS,
      });
    }

    const authCount = await AdminAuthModel.countDocuments();
    if (authCount === 0) {
      const creds = hashPassword(process.env.ADMIN_PASSWORD || 'admin');
      await AdminAuthModel.create({
        key: 'admin_credentials',
        email: 'email.rajan001@gmail.com',
        passwordHash: creds.hash,
        salt: creds.salt,
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Auto-seed check notice (continuing with memory fallbacks):', err);
  }
}
