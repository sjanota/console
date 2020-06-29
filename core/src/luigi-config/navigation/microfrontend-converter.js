import processNodeForLocalDevelopment from './local-development-node-converter';
import { hideByNodeCategory } from './navigation-helpers';

function buildNode(node, spec, config, groups) {
  var n = {
    label: node.label,
    pathSegment: node.navigationPath.split('/').pop(),
    viewUrl: spec.viewBaseUrl ? spec.viewBaseUrl + node.viewUrl : node.viewUrl,
    hideFromNav:
      node.showInNavigation !== undefined ? !node.showInNavigation : false,
    order: node.order,
    context: {
      settings: node.settings
        ? { ...node.settings, ...(node.context || {}) }
        : {}
    },
    requiredPermissions: node.requiredPermissions || undefined
  };

  n.context.requiredBackendModules = node.requiredBackendModules || undefined;
  n.context.groups = groups;

  if (node.externalLink) {
    delete n.viewUrl;
    delete n.pathSegment;
    n.externalLink = {
      url: node.externalLink,
      sameWindow: false
    };
  }

  const isLocalDev = window.location.href.startsWith(
    `http://${config.localDomain}:4200`
  );

  if (isLocalDev && n.viewUrl) {
    n = processNodeForLocalDevelopment(n, spec, config);
  }
  return n;
}

const navigationPathSegments = specNode => specNode.navigationPath.split('/')

function buildNodeWithChildren(specNode, spec, config, groups) {
  var parentNodeSegments = specNode.navigationPath.split('/');
  var children = getDirectChildren(parentNodeSegments, spec, config, groups);
  var node = buildNode(specNode, spec, config, groups);
  if (children.length) {
    node.children = children;
  }
  return node;
}

function getDirectChildren(parentNodeSegments, spec, config, groups) {
  // process only direct children
  return spec.navigationNodes
    .filter(function(node) {
      var currentNodeSegments = node.navigationPath.split('/');
      var isDirectChild =
        parentNodeSegments.length === currentNodeSegments.length - 1 &&
        arraysEqual(parentNodeSegments, currentNodeSegments.slice(0, -1));
      return isDirectChild;
    })
    .map(function mapSecondLevelNodes(node) {
      // map direct children
      return buildNodeWithChildren(node, spec, config, groups);
    });
}

function arraysEqual(arr1, arr2) {
  return arr1.every((el, index) => el === arr2[index]);
}

// todo add coreUIViewGroupName handling
export default function convertToNavigationTree(
  name,
  spec,
  config,
  navigation,
  consoleViewGroupName,
  segmentPrefix,
  groups
) {
  return spec.navigationNodes
    .filter(function getTopLevelNodes(node) {
      var segments = node.navigationPath.split('/');
      return segments.length === 1;
    })

    .map(function processTopLevelNodes(node) {
      return buildNodeWithChildren(node, spec, config, groups);
    })
    .map(function addSettingsForTopLevelNodes(node) {
      if (spec.category) {
        node.category = spec.category;
      }
      if (!node.externalLink) {
        if (!node.pathSegment.startsWith(segmentPrefix)) {
          node.pathSegment = segmentPrefix + node.pathSegment;
        }
        node.navigationContext = spec.appName ? spec.appName : name;
        node.viewGroup = node.navigationContext;

        node.navigationContext = spec.appName ? spec.appName : name;
        if (
          node.viewUrl &&
          node.viewUrl.indexOf(window.location.origin + '/') === 0
        ) {
          node.viewGroup = consoleViewGroupName;
        } else {
          node.viewGroup = node.navigationContext;
        }

        node.keepSelectedForChildren = true;
      }
      return node;
    })
    .map(n => {
      const showExperimentalViews =
        localStorage.getItem('console.showExperimentalViews') === 'true';
      return hideByNodeCategory(n, showExperimentalViews);
    });
}
