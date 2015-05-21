
var TestRepository = {
    //
    defaultProjectModel: {
        name: 'MyProject',
        lib_components: ['Bootstrap'],
        pages: [
            {
                pageName: 'MainPage',
                children:[
                    {
                        type: 'Bootstrap:ReactBootstrap:Panel',
                        props: {},
                        children: [
                            {
                                type: 'Bootstrap:ReactBootstrap:Button',
                                props: {bsStyle: 'primary', disabled: true},
                                children: [
                                    {type: 'span', props: {}, text: 'Click Me'}
                                ]
                            },
                            {
                                type: 'Bootstrap:ReactBootstrap:Button',
                                props: {
                                    bsStyle: 'default', onClick: function () {
                                        alert('Hello !!!');
                                    }
                                },
                                children: [
                                    {type: 'span', props: {}, text: 'Click Me to Hello'}
                                ]
                            },
                            {
                                type: 'Bootstrap:ReactBootstrap:Panel',
                                props: {},
                                children: [
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Button',
                                        props: {bsStyle: 'primary', disabled: false},
                                        children: [
                                            {type: 'span', props: {className: 'text-uppercase'}, text: 'Click Me'}
                                        ]
                                    },
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Button',
                                        props: {bsStyle: 'default'},
                                        children: [
                                            {type: 'span', props: {}, text: 'Click Me'}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    //
    testUserProfile: {
        userName: "John",
        projects: [
            {name: "Project1", createDate: new Date().toLocaleDateString(), lastUpdateDate: new Date().toLocaleDateString()}
        ]
    },

    testProjectModel: {
        name: 'Project1',
        lib_components: ['Bootstrap'],
        pages: [
            {
                pageName: 'MainPage',
                children:[
                    {
                        type: 'Bootstrap:ReactBootstrap:Panel',
                        children: [
                            {
                                type: 'Bootstrap:ReactBootstrap:Button',
                                props: { bsStyle: 'primary', disabled: true, style: {marginTop: '4em', marginTop: '4em', border: '1px solid #000000'}},
                                children: [
                                    {type: 'span', text: 'Click Me'}
                                ]
                            },
                            {
                                type: 'Bootstrap:ReactBootstrap:Button',
                                props: {
                                    bsStyle: 'default', onClick: function () {
                                        alert('Hello !!!');
                                    }
                                },
                                children: [
                                    {type: 'span', text: 'Click Me to Hello'}
                                ]
                            },
                            {
                                type: 'Bootstrap:ReactBootstrap:Panel',
                                //componentName: 'TestComponent1',
                                children: [
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Button',
                                        props: { bsStyle: 'primary', disabled: false},
                                        children: [
                                            {type: 'span', props: { className: 'text-uppercase'}, text: 'Click Me'}
                                        ]
                                    },
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Button',
                                        props: { bsStyle: 'default'},
                                        children: [
                                            {type: 'span', text: 'Click Me'}
                                        ]
                                    },
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Input',
                                        props: { type: "text", addonBefore: { type: 'span', text: '###'}},
                                        children: []
                                    },
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Input',
                                        props: { type: "text", addonBefore: "Just Text"},
                                        children: []
                                    },
                                    {
                                        type: 'Bootstrap:ReactBootstrap:Input',
                                        props: { 'data-umyid': 14, type: "text",
                                            buttonBefore: {
                                                type: 'Bootstrap:ReactBootstrap:Button', children: [
                                                    {type: 'span', text: 'Nested Button'}
                                                ]
                                            }
                                        },
                                        children: []
                                    },                                    {
                                        type: 'Bootstrap:ReactBootstrap:Input',
                                        props: { type: "text",
                                            buttonBefore: {
                                                type: 'Bootstrap:ReactBootstrap:Button', children: [
                                                    {type: 'span', text: 'Nested Button'}
                                                ]
                                            }
                                        },
                                        children: []
                                    },
                                    {
                                        type: 'Bootstrap:Custom:MyInput',
                                        props: { type: "text"},
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    testProjectModel1: {
        name: 'Project1',
        lib_components: ['MaterialUI'],
        pages: [
            {
                pageName: 'MainPage',
                children:[
                    {
                        type: 'div',
                        children: [
                            {
                                type: 'MaterialUI:mui:DatePicker',
                                props: {
                                    hintText: 'Portrait Dialog'
                                },
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    testProjectModel2: {
        name: 'Project1',
        lib_components: ['Bootstrap'],
        pages: [
            {
                pageName: 'MainPage',
                children: [
                    {type: 'Bootstrap:ReactBootstrap:Container',
                        children: [
                            {type: 'Bootstrap:ReactBootstrap:Grid',
                                children: [
                                    {type: 'Bootstrap:ReactBootstrap:Row',
                                        children:[
                                            {type: 'Bootstrap:ReactBootstrap:Col',
                                                props: {
                                                    xs: '6', md: '6', sm: '6', lg: '6'
                                                },
                                                children: [
                                                    {type: 'p', text: 'Empty Col'}
                                                ]
                                            },
                                            {type: 'Bootstrap:ReactBootstrap:Col',
                                                props: {
                                                    xs: '6', md: '6', sm: '6', lg: '6'
                                                },
                                                children: [
                                                    {type: 'p', text: 'Empty Col'}
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }


};

module.exports = TestRepository;
