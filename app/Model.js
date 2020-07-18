export default class Model {
    constructor() {
        this.countries = [];
        this.randomCountries = [];
        this.questionCountry = [];
        this.questionsCount = 0;
        this.score = 0;
    }

    loadCountries() {
        if(this.countries.length) {
            this.take4RandomCountries(this.countries);
            this.getOneOfCountries();
            return Promise.resolve()
        } else {
            return this.getCountryNamesAndCodes()
                .then(countries => {
                    this.take4RandomCountries();
                    this.getOneOfCountries()
                })
                .catch(err => {
                    return Promise.reject(err)
                });
        }
    }

    getCountryNamesAndCodes() {
        return fetch('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code')
            .then(data => data.json())
            .then(countries => this.countries = countries)
            .catch(err => Promise.reject('Something went wrong!'))
    }

    takeRandomCountry(countries) {
        return countries[Math.floor(Math.random() * countries.length)]
    }

    take4RandomCountries() {
        let arr = [];
        while(arr.length < 4) {
            let random = this.takeRandomCountry(this.countries);
            if(arr.includes(random) || random.alpha2Code === 'AZ' || random.alpha2Code === 'TR') continue;
            arr.push(random)
        }
        this.randomCountries = arr;
        return arr
    }

    getOneOfCountries() {
        this.questionCountry = this.takeRandomCountry(this.randomCountries);
        return this.questionCountry
    }

    selectFlag(choiceIndex, handler) {
        if(this.randomCountries[choiceIndex] === this.questionCountry) {
            handler(choiceIndex, true, this.randomCountries.indexOf(this.questionCountry));
            new Promise((resolve) => {
                setTimeout(resolve, 800)
            }).then(() => {
                this.loadCountries()
                    .then(() => this.onLevelChange(this.randomCountries, this.questionCountry, this.questionsCount, this.score))
            })
        } else {
            handler(choiceIndex, false, this.randomCountries.indexOf(this.questionCountry));
            new Promise((resolve) => {
                setTimeout(resolve, 1000)
            })
                .then(() => {
                    this.loadCountries()
                        .then(() => this.onLevelChange(this.randomCountries, this.questionCountry, this.questionsCount, this.score))
                });
        }
    }

    handleScore(choiceIndex) {
        this.questionsCount++;
        if(this.randomCountries[choiceIndex] === this.questionCountry) {
            this.score++
        }
    }

    bindLevelChange(callback) {
        this.onLevelChange = callback
    }

}
