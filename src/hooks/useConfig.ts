import { useState, useEffect } from 'react';
import { Config } from '../types';
import { StorageService } from '../services/StorageService';

export function useConfig() {
  const [config, setConfig] = useState<Config>(StorageService.getConfig());

  useEffect(() => {
    StorageService.saveConfig(config);
  }, [config]);

  return { config, setConfig };
}
