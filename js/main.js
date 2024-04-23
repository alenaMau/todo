let eventBus = new Vue()

Vue.component('task-input', {
    template: `
  <form @submit.prevent="addTackCard">
    <input v-model="title" placeholder="Название заметки " type="text">
    <input v-model="description" placeholder="Описание " type="text">
    <button type="submit">Отправить</button>
    <task-card :notes = "notes"></task-card>
  </form>

 `,
    data() {
        return {
            title: "",
            description: "",
            notes: [],
        };
    },
    methods: {
        addTackCard() {
            const title = this.title;
            const description = this.description;
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push({title, description});
            localStorage.setItem('notes', JSON.stringify(notes))
            window.location.reload()
            this.title = "";
            this.description = "";
            this.notes = notes;
        },
    }
})

Vue.component('task-card', {
    template: `
        <div class="card">
            <div class="column">
                <div v-for="(note, index) in notes" :key="index" class="note">
                    <p if="!completed"> Название заметки: {{ note.title }}</p>
                    <p> Описание задачи: {{ note.description }}</p>
                    <div v-if="note.additionalTasks && note.additionalTasks.length > 0">
                        <p>Дополнительные задачи: </p>
                        <p v-for="task in note.additionalTasks">{{ task }}</p>
                    </div>
                <form @submit.prevent="addTask(index)">
                    <input type="text" v-model="newTasks[index]" placeholder="Добавить задачу">
                    <button type="submit">Добавить</button>
                </form>
                </div>
            </div>
            <div class="column"></div>
            <div class="column"></div>
        </div>
    `,
    props: {
        title: String,
        description: String
    },
    data() {
        return {
            notes: [],
            currentTask: '',
            newTasks:[]
        };
    },
    methods: {
        addTask(index) {
            if (this.newTasks[index] && this.newTasks[index].trim() !== '') {
                if (!this.notes[index].additionalTasks) {
                    this.notes[index].additionalTasks = [this.newTasks[index]];
                } else {
                    this.notes[index].additionalTasks.push(this.newTasks[index]);
                }
                window.location.reload()
                this.newTasks[index] = '';
                localStorage.setItem('notes', JSON.stringify(this.notes));
            }
        }
    },
    created() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.newTasks = new Array(notes.length).fill('');
        this.notes = notes;
    }
});


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart() {
            this.cart.pop();
        },
    }
})



