function() {
  //This script is based code in https://github.com/RadLikeWhoa/Countable
  //Copyright (C) 2015 Sacha Schmid (http://sacha.me)
  // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  // define the Countable object
  const Countable = {
    count: function(target, callback, options) {
      // initialize the count object
      const count = {
        paragraphs: 0,
        sentences: 0,
        words: 0
      };

      // count the paragraphs, sentences, and words in the target element
      const paragraphs = target.innerHTML.trim().split(/(?:\r\n|\r|\n)/g);
      count.paragraphs = paragraphs.length;

      const sentences = target.innerText.trim().split(/[.|!|?]+/g);
      count.sentences = sentences.length;

      const words = target.innerText.trim().split(/\s+/g);
      count.words = words.length;

      // call the callback function with the count object
      callback(count);
    }
  };

  // count the visible words on the page
  let visibleWords = 0;
  const body = document.querySelector('body');
  Countable.count(body, function (counter) {
    visibleWords = counter.words;
  }, { ignore: ['#some-selector', '.another-class'] }); // add any elements you want to ignore inside the ignore array

  return visibleWords;
}
