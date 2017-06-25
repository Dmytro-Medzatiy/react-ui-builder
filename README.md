Description
-----------

This tool is a visual builder of React JS components for your web application. 
In builder you can easily combine available components with each other, and see how they look and feel right on a web page.
Then you can generate a source code of new component from the combination, and builder will include all children and dependencies.
Moreover you can generate Reflux actions/store for your component.

The source code of newly created component can be edited right in the builder or in your favorite IDE it doesn't matter for builder, 
the source code will be automatically compiled and reloaded in builder's pages.

You can include the source code of other third-party components manually ( **'Builder's projects source code structure'** section ).
All newly created/included components are available for composing with other components, 
it means you can reuse your components and combine them with others.

Project's source code is located in local folder on your computer. But you are not intended to create project from scratch because 
builder can download bootstrap project from a gallery of published projects. These projects already have components or 
libraries of components, and other helpful things like css/less/fonts files or webpack predefined configurations, etc.

To access projects gallery you can from the builder, also you can preview pages with components in selected project, 
and download source code of the project into specified local folder.

Feel free to ask questions in [React UI Builder group](https://groups.google.com/forum/#!forum/react-ui-builder)

Features
--------

* A gallery of bootstrap projects with React components and their predefined variants (only react-bootstrap so far).
* Generate source code for new component from any combination of other components.
* Edit source code of the project in other IDEs, builder will reload changes automatically.
* Generate Flux/Reflux actions/store for components.
* Include and use third-party components in builder.

Installation
------------

    npm install react-ui-builder -g
    
For upgrading of version it is better to uninstall and then install:
 
    npm uninstall react-ui-builder -g


Running
-------

Builder runs as a webserver.

    react-ui-builder

Usage
-----

Go to **http://localhost:2222/builder** in browser. 

Browse gallery of published projects. There are a limited amount of completed projects so far, 
but we intensely working on a feature where any user will be available to publish project.

Clone project you liked by specifying local folder where you want to see the source code of the project. 
This folder should exist and be empty.

Cloning and preparing of the project will take some time. 
Most time will be spent by npm installer, builder starts the installation of dependent npm modules automatically after project is downloaded.

Now you can compose components on page, consider page as a desk where you combine components with each other. 

### First look at builder's interface

 <img height="580" width="751" src="https://lh5.googleusercontent.com/-kB4SCEVFa-k/VSQvHi1HcTI/AAAAAAAAA38/WZI-6PwSrRw/w1818-h1404-no/DeskpageStarted.jpg"/>

### Click to select a component on the page

Page consist of components which you can select/copy/paste/delete, also change component's options (properties).

 <img height="580" width="751" src="https://lh5.googleusercontent.com/-FIzOAvyEAb0/VSQvE0vU83I/AAAAAAAAA4g/HOJ_U3QcMBg/w1818-h1404-no/DeskpageComponentSelected.jpg"/>
 
### Add available components into page
 
To add new component into page you have to open left side panel with list of available components, and select component from the list.  
After you have selected component from the list builder is switched into paste mode, it means chosen component is copied into builder's clipboard   
and ready to be pasted in place you indicate.  
 
 <img height="580" width="751" src="https://lh5.googleusercontent.com/-zkt6nbf0_O4/VSQvEMpf21I/AAAAAAAAA3Q/08Get-O0WKQ/w1818-h1404-no/DeskpageAvailableComponents.jpg"/>
 
### Select different variants of available components

There are a lot of variants of listed components inside. 

So you can choose any other variant of any component by clicking on the browse button which appears on the selected list item.
 
 <img height="580" width="751" src="https://lh5.googleusercontent.com/-RRYV5P1eMSA/VSQvIe2waRI/AAAAAAAAA4I/lsRB0cqVFUg/w1818-h1404-no/DeskpageVariants.jpg"/>
 
### Paste component into place

Select any component on the page where you want to place a component from the clipboard. And then choose operation from toolbar above selected component.

To stop paste mode simply click on **'Clear clipboard'** button or **'Cancel'** button on the component toolbar.

 <img height="580" width="751" src="https://lh5.googleusercontent.com/-6TNJXr2XRkE/VSQvEJEiB7I/AAAAAAAAA3E/fDY8COgoNEw/w1818-h1404-no/DeskpageClipboardActions.jpg"/>

### Change component's options (properties)

To change component's options click on the last button on the component's toolbar in selection mode.

 <img height="580" width="751" src="https://lh5.googleusercontent.com/-y1I8Q0TXkWw/VSQvFEccFZI/AAAAAAAAA3U/m32uSNewNH0/w1818-h1404-no/DeskpageComponentSettings.jpg"/>

### View the structure of the page on treeview panel

To look at the page's structure you can toggle treeview panel.  
Treeview is very helpful in cases if you have not visible components on page view.  
All operations from component's toolbar is available in treeview as well.

 <img height="580" width="751" src="https://lh5.googleusercontent.com/-G0fWYwy_wMs/VSQvHyGf4vI/AAAAAAAAA4U/aOscenG0shQ/w1818-h1404-no/DeskpageTreeviewStructure.jpg"/>

### Create source code from combination of components on the page

Any combination of components on the page you can define as new component, and reuse it on other pages in the project. 
To define a new component you have to open options of the parent component in combination, switch to **'Component'** tab and enter the name and group of your component.
Then just select option **'Create component'** and you will see a source code of new component.

There is also a possibility to create Flux/Reflux actions/store for selected component. To create source code for Reflux actions and store, just check checkbox 'Include Reflux actions...'.

After you saved changes, new component will be available on the left-side panel in defined group.

For more information about component's source code see **'Builder's projects source code structure'** section.

 <img height="580" width="751" src="https://lh3.googleusercontent.com/-V1sgM0nahhI/VVD1_YWmrGI/AAAAAAAAA68/NfTCX-dFTAg/w1954-h1384-no/DeskpageComponentSourceBefore.jpg"/>
 
### Merge source code of children components into existing source code of parent component

Builder gives a possibility to modify source code of the existing component by including other child components in it.

Open component source code and write **{this.props.children}** where you want to see new components. After that you will be available to paste components inside of the given component.
After you put some components into parent component, open parent component's source code in builder (select component and open its properties).
In the left top corner of the source code you will see a menu where **'Merge children into source code'** options is, select this option. 
All children components will be included into source code, and builder will include all dependencies.

 <img height="580" width="751" src="https://lh3.googleusercontent.com/-8jBhHCEJuAI/VVD1_qYfAqI/AAAAAAAAA7A/1wd9rZ7O6l8/w1954-h1384-no/DeskpageChildrenMerge.jpg"/>
 
### Proxying HTTP requests 

If your components has to request other HTTP servers you can define a proxy for any HTTP server (except HTTPS).
For example, if a component has to retrieve a JSON from some REST service which is located by address: http://localhost:3000/someService 
and you place this component on page in builder, it will not connect to localhost:3000 due to CORS restriction.
To avoid that you can define proxy for current project, open main menu (bars in top-left corner) and choose **'Project settings'** option.
Specify URL of the server: 'http://localhost:3000'. 
After that your component will be available to connect to /someService (you should use not relative address) right from the builder's page. 

 
### Saving project

Project's page is saved automatically after each changing of the page.
 
### Builder's project source code structure

A project's source code which can be loaded into builder should have the following structure:

    .builder/
		defaults/
		model.json
	src/
		actions/
		components/
		stores/
		components-index.js
	package.json
	
**.builder/** - service folder which builder uses as a temporary storage for compiled files and etc.

**defaults/** - folder where models of different variants of components are located. There are a list of JSON files with names equal to names of components.

**model.json** - model of project pages.

**actions/** - folder where all new generated source code of Reflux actions will be written.

**components/** - folder where all new generated source code of components will be written.

**stores/** - folder where all new generated source code of Reflux stores will be written

There is no any restrictions to structure of any folder, except **.builder** folder. 
Also **components-index.js** file has to be somewhere in project's folder. 
 
**components-index.js** file can be placed almost anywhere in project’s root folder. But we recommend place it into subfolder of root folder.
It gives an ability to properly resolve paths of the components source code files. 

    Note: builder stores generated source code 
          for component into folders: actions, components, stores; 
          and these folders will be created in the same folder 
          where components-index.js file is located.

This file has defined structure, and serves as entry point for webpack compiler of builder.
So if you want to use in builder any other components, and resources (css/less/fonts/etc.), 
you have to include these resources into this file according to webpack recommendations.
 
Structure of **components-index.js** file:

    require(‘./assets/css/css.file’);
    var LibraryComponents = require(‘library’);

    var Components = {
	    Group1: {
		    Component1: LibraryComponents.Component1,
		    Component2: require(‘./Group1/Component2.js’);
	    },
	    Group2: {
		    Component3: require(‘./Group2/Component3.js’);
	    }
    };

    module.expotrs = Components;

**LibraryComponents** - library of components, for example: ReactBootstrap

**Group1, Group2** - groups of components, which will be displayed on left-side panel of builder.

**Component1, Component2, …** - React classes, names has to be unique whithin Components space
	
	Note: builder displays the source code of a component  
	      if it finds the following expression for component variable:
	 
	      require('path_to_component_source_code_file.js')

There is one more restrictions for Reflux files: if you want to see source code of Actions and Store classes of component, 
please give them the same name as component has plus suffix Action and Store. For example see the source code which was created by the builder. 





    
> About bugs or if you have any ideas please write to [umyproto.com](http://umyproto.com) or [React UI Builder group](https://groups.google.com/forum/#!forum/react-ui-builder)


