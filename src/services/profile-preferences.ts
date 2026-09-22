import { getStore } from "@/lib/storage";

const STORAGE_KEY = "fastlearner:profile-preferences:v1";

type ProfilePreferences = {
  version: 1;
  targetInstitutionId: string | null;
  institutionThemeEnabled?: boolean;
};

const emptyPreferences: ProfilePreferences = {
  version: 1,
  targetInstitutionId: null,
  institutionThemeEnabled: false,
};

function readPreferences(): ProfilePreferences {
  const stored = getStore().read<ProfilePreferences>(STORAGE_KEY);
  return stored?.version === 1 ? { ...emptyPreferences, ...stored } : emptyPreferences;
}

export function getTargetInstitutionId() {
  return readPreferences().targetInstitutionId;
}

export function setTargetInstitutionId(targetInstitutionId: string) {
  getStore().write<ProfilePreferences>(STORAGE_KEY, {
    ...readPreferences(),
    targetInstitutionId,
  });
}

export function getInstitutionThemeEnabled() {
  return readPreferences().institutionThemeEnabled === true;
}

export function setInstitutionThemeEnabled(institutionThemeEnabled: boolean) {
  getStore().write<ProfilePreferences>(STORAGE_KEY, {
    ...readPreferences(),
    institutionThemeEnabled,
  });
}