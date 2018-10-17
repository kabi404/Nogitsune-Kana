var score = require('./components/score');

var app = new Vue({
    el: '#app',

    data: {
      currentKana: {
        "character": "#",
        "romaji": "#",
      },
      syllabaries: {
        hiragana: [],
        katakana: []
      },

      selectedSyllabary: 'HIRAGANA',
      selectedKanas: [],
      unusedKanas: [],

      isCorrectAnswer: false,
      isAnswered: false,

      showSettings: false,
      showKanaInfo: false,

      score: {
        next: -1,
        show: 0,
        correctChecks: 0,
        wrongChecks: 0,
      }
    },

    created: function() {
      this.getSyllabaries();
    },

    methods: {
      nextKana: function(){

        if(this.$data.selectedKanas.length == 0){
          this.updateCheckedKanas();
        }

        if(this.$data.unusedKanas.length == 0){
          this.$data.unusedKanas = this.$data.selectedKanas.slice();
        }

        this.$data.isAnswered = false;
        this.$data.showKanaInfo = false;

        var randomKana = Math.floor((Math.random() * this.$data.unusedKanas.length));

        this.$data.currentKana = this.$data.unusedKanas[randomKana];
        this.$data.unusedKanas.splice(randomKana, 1);
        
        document.querySelector('#checker').value = '';

        this.$data.score.next++;
      },

      showAnswer: function(){
        this.$data.showKanaInfo = true;

        this.$data.score.show++;
      },

      checkAnswer: function(){
        this.$data.isCorrectAnswer = 
            document.querySelector('#checker').value.toUpperCase() == this.$data.currentKana.romaji;
        
        if(!this.$data.isAnswered)
          (this.$data.isCorrectAnswer) ? this.$data.score.correctChecks++ : this.$data.score.wrongChecks++;

        this.$data.isAnswered = true;
      },

      getSyllabaries: function () {
        let $this = this;
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', './data/syllabaries.json', true);
        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            $this.$data.syllabaries = JSON.parse(xobj.responseText);
          }
        };
        xobj.send();
      },

      
      toggleSettings: function(){
        this.$data.showSettings = !this.$data.showSettings;
      },
      toggleSyllabary: function(syllabary){
        this.$data.selectedSyllabary = syllabary;
      },

      updateCheckedKanas: function(){
        var $this = this;

        this.$data.selectedKanas = [];
        var syllabary = (this.$data.selectedSyllabary == 'HIRAGANA') ? this.$data.syllabaries.hiragana : this.$data.syllabaries.katakana;

        for(var row = 0; row < syllabary.length; row++){
          for(var item = 0; item < syllabary[row].length; item++){
            if(syllabary[row][item].checked)
              $this.$data.selectedKanas.push(
                syllabary[row][item]
              );
          }
        }

        this.$data.unusedKanas = this.$data.selectedKanas.slice();

        this.$data.score.next = -1;
        this.$data.score.show = 0;
        this.$data.score.correctChecks = 0;
        this.$data.score.wrongChecks = 0;
        
      },

      updateKanaRowCheckBox: function(row, mustCheck){
        var syllabary = (this.$data.selectedSyllabary == 'HIRAGANA') ? this.$data.syllabaries.hiragana : this.$data.syllabaries.katakana;

        for(var i = 0; i < syllabary[row].length; i++){
          syllabary[row][i].checked = mustCheck;
        }
      }
    },

    computed: {
      answer: function(){
        if (this.$data.isAnswered && this.$data.isCorrectAnswer){
          return 'is-success';
        } else if(this.$data.isAnswered){
          return 'is-danger';
        } else {
          return '';
        }
      },

      currentSyllabary: function(){
        if(this.$data.selectedSyllabary == 'HIRAGANA'){
          return this.$data.syllabaries.hiragana;
        } else {
          return this.$data.syllabaries.katakana;
        }
      }
    },

    filters: {
      capitalize: function (str) {
        return str.toLowerCase()
          .replace( /\b./g, val => val.toUpperCase() );
      }

    }
  });