'use strict';
const axios = require('axios');

/**
 * modulo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::modulo.modulo", ({ strapi }) => ({
  async moduleName(ctx) {
    const { moduleName } = ctx.params;

    const _module = await strapi.query("api::modulo.modulo").findOne({
      where: {
        moduleName: moduleName,
      },
      populate: {
        DataGit: true,
      },
    });

    if(!_module) {
      return ctx.notFound();
    }


    const sanitizedModule = await this.sanitizeOutput(_module, ctx);

    if (!_module) {
      return ctx.notFound();
    }

    ctx.body = sanitizedModule;

    return ctx.body;
  },

  async getSonarModules(ctx) {
    try {
      const response = await axios.get(
        "https://sonar.wiz.co/api/components/search",
        {
          params: {
            qualifiers: "TRK",
          },
          headers: {
            Authorization:
              "Basic c3F1XzRkMTFhZWM5NGFjZjVhMTMyMDNmMTk0Y2ExZTI0NGYyM2IwN2QyODQ6",
          },
        }
      );
      
      ctx.body = response.data;
    } catch (error) {
      console.error('Erro ao chamar API do Sonar:', error.response?.data || error.message);
      return ctx.badRequest('Erro ao buscar dados do Sonar', { 
        details: error.response?.data || error.message 
      });
    }
  },

  async getSonarModuleAll(ctx) {
    try {
      const { 
        branch = "main", 
        metricKeys = "bugs,code_smells,reliability_rating,security_rating,security_hotspots,duplicated_lines,quality_gate_details",
        projectKeys = "salesforce-comercial-module,assistencias-web,salesforce-atendimento-module,promotiva-web,biblioteca-module,wecampanhas-module,consulta-margem-module-web,empresas-module,gerenciador-de-modulos-wizpro-modules,perfil-user-module,gup-module,hierarquia-module,notifications-module-web,seguro-residencial-modulo-web,modulo-tema-web"
      } = ctx.request.body;
      const componentes = projectKeys.split(",");

      const response = await axios.get(
        "https://sonar.wiz.co/api/measures/search",
        {
          params: {
            projectKeys: componentes.join(","), // Lista de projetos separados por vírgula
            metricKeys: metricKeys, // Especificando a branch main
          },
          headers: {
            Authorization:
            "Basic c3F1XzRkMTFhZWM5NGFjZjVhMTMyMDNmMTk0Y2ExZTI0NGYyM2IwN2QyODQ6",
          },
        }
      );

      ctx.body = response.data;
    } catch (error) {
      console.error(
        "Erro ao chamar API do Sonar:",
        error.response?.data || error.message
      );
      return ctx.badRequest("Erro ao buscar dados do Sonar", {
        details: error.response?.data || error.message,
      });
    }
  }
  
}));