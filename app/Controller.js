import Model from './Model.js';
import View from './View.js';

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.loadCountries()
            .then(() => this.onLevelChange(this.model.randomCountries, this.model.questionCountry, this.model.questionsCount, this.model.score))
            .catch(() => console.log('Something went wrong, please reload the page!'));

        this.model.bindLevelChange(this.onLevelChange)
    }

    onLevelChange = (countries, question, questionsCount, score) => {
        this.view.displayQuestionAndFlags(countries, question, questionsCount, score);
        this.view.bindFlagSelect(this.handleSelection, this.handleScore);
    };

    handleSelection = (choiceIndex) => {
        this.model.selectFlag(choiceIndex, this.handleCheckAnswer);
    };

    handleCheckAnswer = (choiceIndex, bool, rightAnswerIndex) => {
        this.view.highlightAnswer(choiceIndex, bool, rightAnswerIndex)
    };

    handleScore = (choiceIndex) => {
        this.model.handleScore(choiceIndex)
    }
}

const app = new Controller(new Model(), new View())