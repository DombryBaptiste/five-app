import type { User } from "firebase/auth";

class StorageService {
    private CURRENT_USER_KEY = "currentUser";
    
    private testKeyLength(key: string) {
        if (key.length === 0) {
            throw new Error("La clé ne peut pas être vide.");
        }
    }

    private setItem(key: string, value: string) {
        this.testKeyLength(key);
        localStorage.setItem(key, value);
    }

    private unsetItem(key: string) {
        this.testKeyLength(key);
        localStorage.removeItem(key);
    }

    //#region Current User

    getCurrentUser(): string | null {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user?.length !== 0 ? user : null;
    }

    setCurrentUser(user: User): void {
        this.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    unsetCurrentUser(): void {
        this.unsetItem(this.CURRENT_USER_KEY);
    }

    //#endregion
}

export default new StorageService();