const fs = require('fs');

module.exports = ( plop ) => {
	plop.setGenerator( "component", {
    description: "Create a new component",

    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
      {
        type: "confirm",
        name: "needJs",
        message: "Shoud i create JavaScript file?",
        default: false
      }
    ],

		actions: function(data) {
			var actions = [
        {
          type: "add",
          path: "src/components/{{dashCase name}}/{{dashCase name}}.pug",
          templateFile: "config/plop-templates/component.pug"
        },
        {
          type: "add",
          path: "src/components/{{dashCase name}}/_{{dashCase name}}.scss",
          templateFile: "config/plop-templates/component.scss"
        },
        {
          type: "modify",
          path: "src/styles/master.scss",
          pattern: /(\/\/ Components)/g,
          template: "$1\n@import \"../components/{{dashCase name}}/{{dashCase name}}\";"
        }
      ];

			if(data.needJs) {
				actions.push({
          type: "add",
          path: "src/components/{{dashCase name}}/{{dashCase name}}.js",
          templateFile: "config/plop-templates/component.js"
        });
			}

			return actions;
		}
  });

  plop.setGenerator("page-component", {
    description: "Create a new page component",

    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
      {
        type: "input",
        name: "forPage",
        message: "For what page?"
      },
      {
        type: "confirm",
        name: "needJs",
        message: "Shoud i create JavaScript file?",
        default: false
      }
    ],

    actions: function (data) {
      var actions = [
        {
          type: "add",
          path: "src/pages/{{dashCase forPage}}/components/{{dashCase name}}/{{dashCase name}}.pug",
          templateFile: "config/plop-templates/component.pug"
        },
        {
          type: "add",
          path: "src/pages/{{dashCase forPage}}/components/{{dashCase name}}/_{{dashCase name}}.scss",
          templateFile: "config/plop-templates/component.scss"
        },
        {
          type: "modify",
          path: "src/styles/master.scss",
          pattern: /(\/\/ Components)/g,
          template: "$1\n@import \"../pages/{{dashCase forPage}}/components/{{dashCase name}}/{{dashCase name}}\";"
        }
      ];

      if (data.needJs) {
        actions.push({
          type: "add",
          path: "src/pages/{{dashCase forPage}}/components/{{dashCase name}}/{{dashCase name}}.js",
          templateFile: "config/plop-templates/component.js"
        });
      }

      return actions;
    }
  });

  plop.setGenerator("module", {
    description: "Create a new modules",

    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your module name?",
      },
      {
        type: "confirm",
        name: "needSize",
        message: "Module need sizes template?",
        default: false
      },
      {
        type: "confirm",
        name: "needColors",
        message: "Module need colours template?",
        default: false
      },
      {
        type: "confirm",
        name: "needStates",
        message: "Module need states template?",
        default: false
      }
    ],

    actions: function(data) {
			var actions = [
        {
          type: "add",
          path: "src/styles/modules/_{{dashCase name}}.scss",
          templateFile: "config/plop-templates/module.scss"
        },
        {
          path: "src/styles/master.scss",
          type: "modify",
          pattern: /(\/\/ Modules)/g,
          template: "$1\n@import \"./modules/{{dashCase name}}\";"
        }
      ];

			return actions;
		}
  });

  plop.setGenerator("page", {
    description: "Create a new page",

    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is page name?",
      },
      {
        type: "confirm",
        name: "needScripts",
        message: "Connect scripts from index?",
        default: true
      },
      {
        type: "input",
        name: "task",
        message: "What is task number?"
      },
    ],

    actions: function(data) {
      let gbk_config = JSON.parse(fs.readFileSync('.gbkconfig', 'utf-8'));

      var actions = [
        {
          type: "add",
          path: "src/pages/{{dashCase name}}/{{dashCase name}}.pug",
          templateFile: "config/plop-templates/pages.pug"
        },
        {
          path: "src/index.pug",
          type: "modify",
          pattern: /(\/\/- Pages)/g,
          template: "$1\n\040\040\040\040\040\040li\n\040\040\040\040\040\040\040\040a(href=\"/pages/{{dashCase name}}/{{dashCase name}}.html\") {{ sentenceCase name }}" + "\n\040\040\040\040\040\040\040\040div\n\040\040\040\040\040\040\040\040\040\040a(class=\"task\" href=\"" + gbk_config.project_url + "/tasks/{{task}}\") Task#{{task}}\n\040\040\040\040\040\040\040\040\040\040span.developer " + gbk_config.developer
        },
        {
          path: "src/index.pug",
          type: "modify",
          pattern: /(Project name)/g,
          template: gbk_config.project_name
        },
        {
          path: "src/index.pug",
          type: "modify",
          pattern: /git url/g,
          template: gbk_config.git_url
        },
        {
          path: "src/index.pug",
          type: "modify",
          pattern: /project url/g,
          template: gbk_config.project_url
        },
        {
          path: "src/index.pug",
          type: "modify",
          pattern: /spec url/g,
          template: gbk_config.spec_url
        },
        {
          path: "config/backstop-pages.js",
          type: "modify",
          pattern: /(\/\/ Pages)/g,
          template: "$1\n\040\040\'/pages/{{ lowerCase name }}.html\'\,"
        },
      ];

      return actions;
    }
  })
};
