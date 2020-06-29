const { default: convertToNavigationTree } = require("./microfrontend-converter")

describe('microfrontend-converter', () => {
    it('is backwards compatible', () => {
        expect(convertToNavigationTree('serverless', Object.freeze({
            "name": "serverless",
            "category": "Development",
            "viewBaseUrl": "https://core-ui.testowy.hasselhoff.ga",
            "preloadUrl": "https://aaa.com",
            "placement": "namespace",
            "navigationNodes": Object.freeze([
              Object.freeze({
                "label": "Functions",
                "navigationPath": "functions",
                "viewUrl": "/lambdas",
                "showInNavigation": true,
                "order": 1,
                "settings": Object.freeze({}),
                "externalLink": "",
                "requiredPermissions": Object.freeze([])
              }),
              {
                "label": "Functions",
                "navigationPath": "functions/details",
                "viewUrl": "/lambdas",
                "showInNavigation": false,
                "order": 0,
                "settings": Object.freeze({}),
                "externalLink": "",
                "requiredPermissions": Object.freeze([])
              },
              {
                "label": "Function Details",
                "navigationPath": "functions/details/:lambda",
                "viewUrl": "/lambda/:lambda",
                "showInNavigation": false,
                "order": 0,
                "settings": Object.freeze({}),
                "externalLink": "",
                "requiredPermissions": Object.freeze([])
              }
            ])
          }),Object.freeze({
            "domain": "testowy.hasselhoff.ga",
            "localDomain": "console-dev.testowy.hasselhoff.ga",
            "serviceCatalogModuleUrl": "http://console-dev.testowy.hasselhoff.ga:8000",
            "serviceInstancesModuleUrl": "https://instances.testowy.hasselhoff.ga",
            "serviceBrokersModuleUrl": "https://brokers.testowy.hasselhoff.ga",
            "docsModuleUrl": "http://console-dev.testowy.hasselhoff.ga:8003",
            "addOnsModuleUrl": "http://console-dev.testowy.hasselhoff.ga:8004",
            "logsModuleUrl": "http://console-dev.testowy.hasselhoff.ga:8005",
            "coreModuleUrl": "http://console-dev.testowy.hasselhoff.ga:8889",
            "graphqlApiUrl": "https://console-backend.testowy.hasselhoff.ga/graphql",
            "apiserverUrl": "https://apiserver.testowy.hasselhoff.ga",
            "disabledNavigationNodes": "",
            "compassDefaultTenant": "3e64ebae-38b5-46a0-b1ed-9ccee153a0ae",
            "systemNamespaces": "compass-system istio-system knative-eventing knative-serving kube-public kube-system kyma-backup kyma-installer kyma-integration kyma-system natss kube-node-lease kubernetes-dashboard serverless-system",
            "consoleClientId": "console",
            "graphqlApiUrlLocal": "http://console-dev.testowy.hasselhoff.ga:3000/graphql",
            "namespaceAdminGroupName": "runtimeNamespaceAdmin",
            "compassAutomaticDefaultScenario": "true",
            "compassApiUrl": "https://compass-gateway.testowy.hasselhoff.ga/director/graphql",
            "orgName": "My Organization",
            "defaultIdpJwksUri": "http://dex-service.kyma-system.svc.cluster.local:5556/keys",
            "compassModuleUrl": "http://console-dev.testowy.hasselhoff.ga:8888",
            "scope": "audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups",
            "subscriptionsApiUrl": "wss://console-backend.testowy.hasselhoff.ga/graphql",
            "runtimeAdminGroupName": "runtimeAdmin",
            "authRedirectUri": "http://console-dev.testowy.hasselhoff.ga:4200",
            "subscriptionsApiUrlLocal": "ws://console-dev.testowy.hasselhoff.ga:3000/graphql",
            "HELM_BROKER_REPO_URL_PREFIXES": "https://|git::|github.com/|bitbucket.org/|http://",
            "gateway_kyma_cx_api_version": "v1alpha2",
            "defaultIdpIssuer": "https://dex.testowy.hasselhoff.ga",
            "orgId": "my-org-123"
          }),Object.freeze({
            "viewGroupSettings": Object.freeze({
              "_console_": Object.freeze({
                "preloadUrl": "/consoleapp.html#/home/preload"
              }),
              "_core_ui_": Object.freeze({
                "preloadUrl": "http://console-dev.testowy.hasselhoff.ga:8889/preload"
              }),
              "addonsclustermicrofrontend": Object.freeze({
                "preloadUrl": "http://console-dev.testowy.hasselhoff.ga:8004/preload"
              }),
              "servicecatalogmicrofrontend": Object.freeze({
                "preloadUrl": "http://console-dev.testowy.hasselhoff.ga:8000/preload"
              }),
              "addonsmicrofrontend": Object.freeze({
                "preloadUrl": "http://console-dev.testowy.hasselhoff.ga:8004/preload"
              })
            }),
            "contextSwitcher": Object.freeze({
              "defaultLabel": "Select Namespace ...",
              "parentNodePath": "/home/namespaces",
              "lazyloadOptions": true,
              "actions": Object.freeze([
                Object.freeze({
                  "label": "+ New Namespace",
                  "link": "/home/workspace?~showModal=true"
                })
              ])
            }),
            "profile": Object.freeze({
              "items": Object.freeze([
                Object.freeze({
                  "icon": "settings",
                  "label": "Preferences",
                  "link": "/home/preferences"
                }),
                Object.freeze({
                  "icon": "download",
                  "label": "Get Kubeconfig",
                  "link": "/home/download-kubeconfig"
                })
              ])
            }),
            "nodes": Object.freeze({})
          }), '_console_', 'cmf-', undefined)).toMatchSnapshot()
    })
})