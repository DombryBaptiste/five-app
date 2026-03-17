class StorageService {
    private testKeyLength(key: string) {
        if (key.length === 0) {
            throw new Error("La clé ne peut pas être vide.");
        }
    }

    setItem(key: string, value: string) {
        this.testKeyLength(key);
        localStorage.setItem(key, value);
    }

    unsetItem(key: string) {
        this.testKeyLength(key);
        localStorage.removeItem(key);
    }
}

export default new StorageService();