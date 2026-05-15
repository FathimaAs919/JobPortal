import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Some doc/docx mimetypes can be complex depending on browser, but we check extname generally or specific mimetypes
    const mimetype = filetypes.test(file.mimetype) || file.mimetype.includes('word') || file.mimetype.includes('document');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Resumes must be PDF or DOC/DOCX files only!'));
    }
}

export const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});
