"use strict";
const axios = require("axios");

/**
 * clarity controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::insight.insight", ({ strapi }) => ({
    async insightsByTenant(ctx) {
      const { tenant } = ctx.params;

      const insights = await strapi.documents("api::insight.insight").findMany({
        filters: {
          clarity: {
            idtenant: tenant,
          },
        },
        populate: {
          clarity: true,
        },
        sort: { lastUpdate: 'desc' },
        limit: 1
      });


      
      if (!insights) {
        return ctx.notFound();
      }
      
      const lastInsight = await insights.filter((insight) => {
        return insight.clarity.idtenant === tenant;
      })[0];
      
      // Caso não encontre nenhum insight
      // criamos um novo.
      if (!lastInsight) {
        const firstAccess = await strapi.query("api::clarity.clarity").findOne({
          where: {
            idTenant: tenant,
          },
        });

        if (!firstAccess) {
          return ctx.badRequest("Não encontramos essa tenant", {
            datal: null,
          });
        }

        const newData = await this.updateInsightTenant({
          params: {
            tenant: firstAccess.Tenant,
            idTenat: firstAccess.id,
            token: firstAccess.Token,
          },
        });
        return ctx.send({ data: newData });
      }

      const dataLastUpdate = lastInsight.lastUpdate;

      if (!dataLastUpdate) {
        return ctx.badRequest("Não encontramos data de atualização", {
          data: lastInsight,
        });
      }

      const dateNow = new Date().getTime();
      const dateLastUpdate = new Date(dataLastUpdate).getTime();

      const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
      const isMoreThanSevenDays = dateNow - dateLastUpdate > SEVEN_DAYS_IN_MS;
      // Valida se a última atualização foi a mais de 7 dias
      if (isMoreThanSevenDays) {
        const newData = await this.updateInsightTenant({
          params: {
            tenant: lastInsight.clarity.Tenant,
            idTenat: lastInsight.clarity.id,
            token: lastInsight.clarity.Token,
          },
        });

        return ctx.send({ ...newData });
      }

      const newData = {
        ...lastInsight,
        clarity : {
          ...lastInsight.clarity,
          Token: null,
        },
      }

      return ctx.send({ ...newData });
    },

    async updateInsightTenant(ctx) {
      const { tenant, idTenat, token } = ctx.params;

      try {

        console.log(`[Clarity API] Iniciando requisição para tenant: ${tenant}`);

        const request = await axios.get(
          `https://www.clarity.ms/export-data/api/v1/project-live-insights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 segundos de timeout
          }
        );

        console.log(`[Clarity API] Resposta recebida com status: ${request.status}`);

        if (request.status !== 200) {
          console.error(`[Clarity API] Erro na requisição: ${request.status}`, request.data);
          return ctx.badRequest("Erro ao buscar dados", {
            status: request.status,
            data: request.data
          });
        }

        const data = request.data;

        if (!data) {
          console.error('[Clarity API] Dados vazios recebidos');
          return ctx.badRequest("Erro ao buscar dados", {});
        }

        const insight = await strapi.query("api::insight.insight").create({
          data: {
            data,
            Tenant: tenant,
            idtenant: idTenat,
            clarity: idTenat,
            lastUpdate: new Date(),
            publishedAt: new Date(),
          },
        });

        if (!insight) {
          console.error('[Clarity API] Erro ao salvar insight no banco');
          return ctx.badRequest("Erro ao salvar dados", {});
        }

        console.log(`[Clarity API] Insight salvo com sucesso para tenant: ${tenant}`);
        return insight;
      } catch (error) {
        console.error('[Clarity API] Erro na requisição:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });

        return ctx.badRequest("Erro ao processar requisição", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
    },

    async find(ctx) {
      const result = await super.find(ctx);
      return result;
    }
  })
);
