class Base64Converter {
    Base64Converter() {
    }
    static encodeUtf8ToBase64(utf8String) {
        return Buffer.from(utf8String, 'utf-8').toString('base64');
    }
    static decodeBase64ToUtf8(base64String) {
        return Buffer.from(base64String, 'base64').toString('utf-8');
    }
}

module.exports = Base64Converter;