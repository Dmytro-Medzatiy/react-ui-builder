'use strict';

var HtmlComponents = {
    'input': {
        props: {
            type: 'text',
            placeholder: 'Enter value'
        }
    },
    'button': {
        children: [
            {type: 'span', text: 'Button'}
        ]
    },
    'h1':  {
        children:[
            {type: 'span', text: 'Empty h1'}
        ]
    },
    'h2': {
        children:[
            {type: 'span', text: 'Empty h2'}
        ]
    },
    'h3': {
        children:[
            {type: 'span', text: 'Empty h3'}
        ]
    },
    'h4': {
        children:[
            {type: 'span', text: 'Empty h4'}
        ]
    },
    'h5': {
        children:[
            {type: 'span', text: 'Empty h5'}
        ]
    },
    'span': {
        text: 'Text'
    },
    'strong': {
        text: 'Strong text'
    },
    'small': {
        text: 'Small text'
    },
    'div': {
        children: [
            {type: 'span', text: 'Empty div'}
        ]
    },
    'p': {
        children: [
            {type: 'span', text: 'Empty p'}
        ]
    },
    'path': {
        props: {
            d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
        }
    },
    'blockquote': {
        children: [
            {type: 'p', children:[
                {type: 'span', text: 'This is a quotation'}
            ]}
        ]
    },
    'hr': {},
    'a': {
        props: {
            href: "#"
        },
        children:[
            {type: 'span', text: 'Link text'}
        ]
    },
    'select': {
        children: [
            {type: 'option', text: 'option #1'},
            {type: 'option', text: 'option #2'},
            {type: 'option', text: 'option #3'},
            {type: 'option', text: 'option #4'},
            {type: 'option', text: 'option #5'}
        ]
    },
    'option': {
        text: 'select option'
    },
    'img': {
        props: {
            width: 200,
            height: 100,
            src: 'http://placehold.it/200x100'
        }
    },
    'form': {
        children:[
            {type: 'span', text: 'Empty form'}
        ]
    },
    'table': {
        children:[
            {type: 'thead',
                children: [
                    {
                        type: 'tr',
                        children: [
                            {
                                type: 'th',
                                children: [
                                    {type: 'span', text: 'Text in th'}
                                ]
                            },
                            {
                                type: 'th',
                                children: [
                                    {type: 'span', text: 'Text in th'}
                                ]
                            },
                            {
                                type: 'th',
                                children: [
                                    {type: 'span', text: 'Text in th'}
                                ]
                            },
                            {
                                type: 'th',
                                children: [
                                    {type: 'span', text: 'Text in th'}
                                ]
                            }
                        ]
                    }
                ]
            },
            {type: 'tbody',
                children: [
                    {
                        type: 'tr',
                        children: [
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            },
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            },
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            },
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            }
                        ]
                    },
                    {
                        type: 'tr',
                        children: [
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            },
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            },
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            },
                            {
                                type: 'td',
                                children: [
                                    {type: 'span', text: 'Text in td'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'thead': {
        children: [
            {
                type: 'tr',
                children: [
                    {
                        type: 'th',
                        children: [
                            {type: 'span', text: 'Text in th'}
                        ]
                    }
                ]
            }
        ]
    },
    'tbody': {
        children: [
            {
                type: 'tr',
                children: [
                    {
                        type: 'td',
                        children: [
                            {type: 'span', text: 'Text in td'}
                        ]
                    }
                ]
            }
        ]
    },
    'tr': {
        children: [
            {
                type: 'td',
                children: [
                    {type: 'span', text: 'Text in td'}
                ]
            }
        ]
    },
    'td': {
        children: [
            {type: 'span', text: 'Text in td'}
        ]
    },
    'th': {
        children: [
            {type: 'span', text: 'Text in th'}
        ]
    },
    'ol': {
        children: [
            {type: 'li', children: [
                {type: 'span', text: 'First Item'}
            ]},
            {type: 'li', children: [
                {type: 'span', text: 'Second Item'}
            ]},
            {type: 'li', children: [
                {type: 'span', text: 'Third Item'}
            ]}
        ]
    },
    'ul': {
        children: [
            {type: 'li', children: [
                {type: 'span', text: 'First Item'}
            ]},
            {type: 'li', children: [
                {type: 'span', text: 'Second Item'}
            ]},
            {type: 'li', children: [
                {type: 'span', text: 'Third Item'}
            ]}
        ]
    },
    'li':{
        children:[
            {type: 'span', text: 'List Item'}
        ]
    },
    'dl': {
        children:[
            {type: 'dt', children:[
                {type: 'span', text: 'Main text'}
            ]},
            {type: 'dd', children:[
                {type: 'span', text: 'Description text line'}
            ]},
            {type: 'dt', children:[
                {type: 'span', text: 'Main text'}
            ]},
            {type: 'dd', children:[
                {type: 'span', text: 'Description text line'}
            ]}
        ]
    },
    'dt': {
        children: [
            {type: 'span', text: 'Main text'}
        ]
    },
    'dd': {
        children: [
            {type: 'span', text: 'Description text line'}
        ]
    }

};

module.exports = HtmlComponents;