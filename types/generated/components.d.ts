import type { Schema, Attribute } from '@strapi/strapi';

export interface EnvEnv extends Schema.Component {
  collectionName: 'components_env_envs';
  info: {
    displayName: 'Env';
    icon: 'shield';
  };
  attributes: {
    filedoc: Attribute.Media;
    Env: Attribute.JSON;
    SubRoutes: Attribute.JSON;
  };
}

export interface GitGit extends Schema.Component {
  collectionName: 'components_git_gits';
  info: {
    displayName: 'Git';
    icon: 'server';
    description: '';
  };
  attributes: {
    urlRepository: Attribute.String;
    nameRepository: Attribute.String;
    namebranch: Attribute.String;
    namesBranchs: Attribute.JSON;
    lastCommitAuthor: Attribute.String;
    lastCommitMessage: Attribute.Text;
  };
}

export interface UikitUikit extends Schema.Component {
  collectionName: 'components_uikit_uikits';
  info: {
    displayName: 'uikit';
    icon: 'write';
    description: '';
  };
  attributes: {
    componentsUikit: Attribute.JSON;
    Git: Attribute.Component<'git.git'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'env.env': EnvEnv;
      'git.git': GitGit;
      'uikit.uikit': UikitUikit;
    }
  }
}
