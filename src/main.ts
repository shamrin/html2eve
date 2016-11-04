import parse5 from 'parse5';

console.log('hello world?!');

var document     = parse5.parse('<!DOCTYPE html><html><body>Hi there!</body></html>');
var documentHtml = parse5.serialize(document);