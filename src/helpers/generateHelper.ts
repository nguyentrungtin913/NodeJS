import { findByPath } from '../models/file';
import fs from 'fs';
export async function nameDefault(dir: string) {
    let dem = 0
    while (true) {
        console.log(dir + "New.dig")
        console.log(dem)
        if (dem !== 0) {
            if (!fs.existsSync(dir + "New-" + dem + ".dig")) {
                break;
            }
        }else{
            if (!fs.existsSync(dir + "New.dig")) {
                break;
            }
        }
        dem++;
    }
    return dem;
}