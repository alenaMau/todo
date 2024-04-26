Vue.component('task-input', {
    template: `
  <form @submit.prevent="addTackCard" >
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
            if (!this.checkMaxTasks()) {
                alert('Исчерпано максимальное кол-во новых задач!')
                return;
            }
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            const title = this.title;
            const description = this.description;
            const progress = 0;
            const nestedTasks = [];
            const lastUpdatedDate = new Date().toLocaleTimeString()
            if (title && description) {
                notes.push({title, description, progress, nestedTasks, lastUpdatedDate});
                localStorage.setItem('notes', JSON.stringify(notes))
            }
            this.title = "";
            this.description = "";
            this.notes = notes;
            this.$forceUpdate();
        },
        checkMaxTasks() {
            let lowProgressTasksCount = 0;
            this.notes.forEach(elem => {
                if (elem.progress < 50) {
                    lowProgressTasksCount++;
                }
            });
            return lowProgressTasksCount < 3;
        },
    }
})

Vue.component('task-card', {
    template: `
         <div class="card">
            <div class="column">
                <div v-for="(note, index) in notes" :key="index" >
                <div v-if="note.progress < 50" class="note">
                 <p > Название заметки: {{ note.title }}</p>
                    <p>Описание: {{ note.description }}</p>
                    <div v-if="note.nestedTasks && note.nestedTasks.length > 0 " >
                        <p>Пункты: </p>
                         <p v-for="(task, taskIndex) in note.nestedTasks" @click="toggleCompleted(index, taskIndex)" :class="{ 'completed': task.completed }">{{ task.name }}</p>
                    </div>
                <form @submit.prevent="addTask(index)">
                    <input type="text" v-model="newTaskName[index]" placeholder="Добавить задачу">
                    <button type="submit">Добавить</button>
                </form>
                <div v-if="note.nestedTasks.length < 3 ">
                    Вы должны добавить не менее 3 задач.
                </div>
                </div>
                </div>
            </div>
            <div class="column">
             <div v-for="(note, index) in notes" :key="index">
             <div v-if="note.progress >= 50 && note.progress != 100" class="note">
              <p > Название заметки: {{ note.title }}</p>
                    <p>Описание: {{ note.description }}</p>
                    <p  @click="toggleCompleted(note)" :class="{ 'completed': note.completed }">Задачи: {{ note.description }}</p>
                    <div>
                        <p>Пункты:</p>
                         <p v-for="(task, taskIndex) in note.nestedTasks" @click="toggleCompleted(index, taskIndex)" :class="{ 'completed': task.completed }">{{ task.name }}</p>
                    </div>
            </div>    
            </div>
            </div>
             <div class="column">
                <div v-for="(note, index) in notes" :key="index" >
                <div v-if="note.progress == 100" class="note">
                    <p > Название заметки: {{ note.title }}</p>
                    <p>Описание: {{ note.description }}</p>
                    <p>Дата последнего обновления: {{note.time}}</p>
                    <p  @click="toggleCompleted(note)" :class="{ 'completed': note.completed }">Описание: {{ note.description }}</p>
                    <p v-for="(task, taskIndex) in note.nestedTasks" @click="toggleCompleted(index, taskIndex)" :class="{ 'completed': task.completed }" >{{ task.name }}</p>
                </div>
                </div>
            </div>
        </div>  
    `,
    props: {
        title: String,
        description: String,
        notes: Array
    },
    data() {
        return {
            newTaskName:[],
            progress:0,
        };
    },
    methods: {
        addTask(index) {
            if (this.notes[index]) {
                if (this.notes[index].nestedTasks.length < 5) {
                        this.notes[index].nestedTasks.push({ name: this.newTaskName[index], completed: false });
                    localStorage.setItem('notes', JSON.stringify(this.notes));
                } else {
                    alert('Лимит задач достигнут.');
                }
            }
            this.$forceUpdate();
        },
        toggleCompleted(index,taskIndex) {
            const currentParentTask = this.notes[index];
            const currentTask = currentParentTask.nestedTasks[taskIndex];
            if (currentParentTask.nestedTasks.length < 3) {
                alert('Вы должны добавить не менее 3 задач, чтобы зачеркивать.');
                return;
            }
            if (!this.checkMaxHalfTasks() && currentParentTask.progress < 50) {
                alert('Исчерпано максимальное кол-во недоделанных задач!')
                return;
            }
            currentTask.completed = !currentTask.completed;
            const countNestedTasks = this.notes[index].nestedTasks.length;
            let completedTasks = 0;
            this.notes[index].nestedTasks.forEach(elem => {
                if (elem.completed) {
                    completedTasks++;
                }
            });
            this.notes[index].progress = Math.round(completedTasks / countNestedTasks * 100);
            this.notes[index].time = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString();
            localStorage.setItem('notes', JSON.stringify(this.notes));
            this.$forceUpdate();
        },
        checkMaxHalfTasks() {
            let mediumProgressTasksCount = 0;
            this.notes.forEach(elem => {
                if (elem.progress >= 50 && elem.progress !== 100) {
                    mediumProgressTasksCount++;
                }
            });
            return mediumProgressTasksCount < 5;
        },
    },
    created() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    }
})
;


let app = new Vue({
    el: '#app',

})




