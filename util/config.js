import fs from 'fs';
import YAML from 'yaml';

const file = fs.readFileSync('./config.yaml', 'utf8');

export const {
  zip_code: zipCode, webhook, skus, delay: delayTime,
} = YAML.parse(file);
