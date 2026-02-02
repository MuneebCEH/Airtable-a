import { PDFParse } from 'pdf-parse';
import fs from 'fs';

async function test() {
    try {
        const buffer = fs.readFileSync('new pdfd.PDF');
        console.log('Buffer size:', buffer.length);

        // Let's try to find how to use this thing.
        // If it's a class, maybe it has a static method we missed?
        console.log('PDFParse properties:', Object.getOwnPropertyNames(PDFParse));

        // Maybe it's a function that returns an instance?
        // But we tried calling it as a function and it failed with "must use new".

        const instance = new PDFParse(buffer);
        console.log('Instance created');

        // Check instance methods again
        const proto = Object.getPrototypeOf(instance);
        console.log('Prototype methods:', Object.getOwnPropertyNames(proto));

        // Let's try to see if it's promise-like
        if (typeof instance.then === 'function') {
            console.log('Instance is thenable');
        } else {
            console.log('Instance is NOT thenable');
        }

        // Search for text extraction method
        // In some versions it's .allText() or similar
        // Let's check the constructor source or prototype again

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
