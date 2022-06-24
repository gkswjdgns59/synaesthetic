
const PhonemeDb = {
    A : {
        firstConsonants : ['ㄱ', 'ㅈ'],
        vowels: {
            large : ['ㅓ', 'ㅜ'],
            medium_large : ['ㅓ', 'ㅗ'],
            medium_small : ['ㅏ', 'ㅜ'],
            small : ['ㅏ', 'ㅡ']
        },
        lastConsonants : ['ㅇ', 'ㅇ']
    },
    B : {
        firstConsonants : ['ㄲ', 'ㅊ'],
        vowels: {
            large : ['ㅓ', 'ㅜ'],
            medium_large : ['ㅓ', 'ㅗ'],
            medium_small : ['ㅏ', 'ㅜ'],
            small : ['ㅏ', 'ㅗ']
        },
        lastConsonants : ['ㅇ', 'ㅇ']
    },
    C : {
        firstConsonants : ['ㅊ', 'ㄹ'],
        vowels: {
            large : ['ㅜ', 'ㅓ'],
            medium_large : ['ㅓ', 'ㅓ'],
            medium_small : ['ㅏ', 'ㅏ'],
            small : ['ㅗ', 'ㅏ']
        },
        lastConsonants : ['ㄹ', 'ㅇ']
    },
    D : {
        firstConsonants : ['ㄷ', 'ㅂ'],
        vowels: {
            large : ['ㅜ', 'ㅓ'],
            medium_large : ['ㅓ', 'ㅓ'],
            medium_small : ['ㅏ', 'ㅏ'],
            small : ['ㅗ', 'ㅗ']
        },
        lastConsonants : ['', 'ㄱ']
    },
    E : {
        firstConsonants : ['ㅌ', 'ㅂ'],
        vowels: {
            large : ['ㅜ', 'ㅓ'],
            medium_large : ['ㅓ', 'ㅓ'],
            medium_small : ['ㅏ', 'ㅏ'],
            small : ['ㅗ', 'ㅏ']
        },
        lastConsonants : ['', 'ㄱ']
    },
    F : {
        firstConsonants : ['ㅅ', 'ㄷ'],
        vowels: {
            large : ['ㅓ', 'ㅡ'],
            medium_large : ['ㅡ', 'ㅡ'],
            medium_small : ['ㅏ', 'ㅡ'],
            small : ['ㅗ', 'ㅡ']
        },
        lastConsonants : ['ㄴ', 'ㄹ']
    },
    G : {
        firstConsonants : ['ㅅ', 'ㄱ'],
        vowels: {
            large : ['ㅓ', 'ㅡ'],
            medium_large : ['ㅡ', 'ㅡ'],
            medium_small : ['ㅏ', 'ㅡ'],
            small : ['ㅗ', 'ㅡ']
        },
        lastConsonants : ['ㄹ', 'ㅁ']
    },
    H : {
        firstConsonants : ['ㅌ', 'ㄷ'],
        vowels: {
            large : ['ㅜ', 'ㅓ'],
            medium_large : ['ㅓ', 'ㅓ'],
            medium_small : ['ㅏ', 'ㅏ'],
            small : ['ㅗ', 'ㅏ']
        },
        lastConsonants : ['', 'ㄹ']
    },
    I : {
        firstConsonants : ['ㅅ', 'ㄹ'],
        vowels: {
            large : ['ㅜ', 'ㅓ'],
            medium_large : ['ㅓ', 'ㅓ'],
            medium_small : ['ㅏ', 'ㅏ'],
            small : ['ㅗ', 'ㅏ']
        },
        lastConsonants : ['ㄹ', 'ㅇ']
    },
};

module.exports = { PhonemeDb };