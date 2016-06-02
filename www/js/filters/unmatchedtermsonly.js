(function() {
  'use strict';
  angular
    .module('washery.filters')
    .filter('unmatchedTermsOnly', unmatchedTermsOnly);

  function unmatchedTermsOnly() {
    return function (terms, prediction) {
        var i, term, filtered = [];

        for (i = 0; i < terms.length; i++) {
            term = terms[i];
            if (prediction.matched_substrings.length > 0 && term.offset > prediction.matched_substrings[0].length) {
                filtered.push(term);
            }
        }

        return filtered;
    };
  }
})();