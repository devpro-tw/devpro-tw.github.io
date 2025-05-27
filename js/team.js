class TeamMember {
    constructor(name, title, expertise, avatar) {
        this.name = name;
        this.title = title;
        this.expertise = expertise;
        this.avatar = avatar;
    }

    async render() {
        const response = await fetch('/components/team-member.html');
        const html = await response.text();
        
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        
        const card = tempContainer.firstElementChild;
        card.querySelector('.avatar').src = this.avatar;
        card.querySelector('.name').textContent = this.name;
        card.querySelector('.title').textContent = this.title;
        card.querySelector('.expertise').textContent = this.expertise;
        
        return card;
    }
}