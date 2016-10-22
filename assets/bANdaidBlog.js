var adjectives=["back", "bad", "baffling", "bang", "bad", "basic", "beautiful", "becoming", "belated", "beloved", "beneficial", "beware", "buggy", "biased", "bleak", "brief", "bloated", "blundering", "brilliant", "bogus", "bold", "boring", "brainy"];
var adjectivesLenght=adjectives.length;

function setTitleHover(){
  var index=Math.floor(Math.random() * adjectivesLenght);
  var newTitle=adjectives[index]+"! Alexander Nittka's development aid";
  document.getElementById('blog-title-ahref').title = newTitle;
}