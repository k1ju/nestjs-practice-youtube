import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

export const multerOptions = {
  fileFilter: (req, file, cb) => {
    const acceptedExtensionList = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (acceptedExtensionList.includes(extname)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type'), 400, false);
    }
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './media';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = Date.now();
      cb(null, `${filename}${path.extname(file.originalname)}`);
    },
  }),
};
