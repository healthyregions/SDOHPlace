class SuggestionManager {
  private inProgressSuggestions: Set<string> = new Set<string>();
  addSuggestion(suggestion: string): void {
    this.inProgressSuggestions.add(suggestion);
  }
  removeSuggestion(suggestion: string): void {
    this.inProgressSuggestions.delete(suggestion);
  }
  hasSuggestion(suggestion: string): boolean {
    return this.inProgressSuggestions.has(suggestion);
  }
  clearAll(): void {
    this.inProgressSuggestions.clear();
  }
  cleanupSuggestions(validSuggestions: string[]): void {
    Array.from(this.inProgressSuggestions).forEach(suggestion => {
      if (!validSuggestions.includes(suggestion)) {
        this.inProgressSuggestions.delete(suggestion);
      }
    });
  }
  getAllSuggestions(): string[] {
    return Array.from(this.inProgressSuggestions);
  }
}
const suggestionManager = new SuggestionManager();
export default suggestionManager; 