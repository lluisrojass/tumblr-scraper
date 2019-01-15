// test next page emit
// test original post 
// test 
const Parser = require('../index');
const sinon = require('sinon');
const { tumblrPostTypes: types } = require('../../../config.json');

describe('Archive Parser', () => {
    let parser;
    let spy;

    describe('#originalPost', () => {
        beforeEach(() => {
            spy = new sinon.spy();
        });
        it('should identify an original post', () => {
            parser = new Parser([ types.photo ], 'test');
            parser.on('post', spy);
            
        })
    });

    describe('#dateUpdate', () => {

    });


    it('should correctly idenfity a text post')
    it('should correctly idenfity an chat post')
    it('should correctly idenfity a ask post')
    it('should correctly idenfity a photo post')
    it('should correctly idenfity a video post')
    it('should correctly idenfity a audio post')

    
})