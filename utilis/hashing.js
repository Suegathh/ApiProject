import pkg from 'bcryptjs'
const { hash, compare } = pkg;
import {createHmac} from 'crypto';
export const doHash = async (value, saltValue) => {
    try {
        const result = await hash(value, saltValue);
        return result;
    } catch (error) {
        console.error('Error during hashing:', error);
        throw error; // Re-throw the error to handle it where this function is called
    }
};
// Validate a value against a hashed value
export const doHashValidation = async (value, hashedValue) => {
    try {
        const result = await compare(value, hashedValue);
        return result;
    } catch (error) {
        console.error('Error during hash validation:', error);
        throw error; // Re-throw the error to handle it where this function is called
    }
};
export const hmacProcess = (value, key) => {
    const result = createHmac('256', key).update(value).digest('hex')
    return result
}