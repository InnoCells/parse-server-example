const logger = require('../logger');
const _ = require('lodash');
const PreFacturaInfrastructureService = require('../API/PreFacturaInfrastructureService');
const FacturaInfrastructureService = require('../API/FacturaInfrastructureService');
const InsertFacturaRequest = require('../API/DTO/InsertFacturaRequest');
const dateUtils = require('../utils/dateUtils');
const StatusFacturaEnum = require('../utils/statusFacturaEnum');

async function prepararFacturas() {
  try {
    const result = await PreFacturaInfrastructureService.getAllPreFacturas();
    for (var i = 0; i < result.length; i++) {
      try {
        const preFactura = result[i].getPlainObject;
        const anyoFacturacion = preFactura.mesFacturacion.getFullYear();
        const mesFacturacion = dateUtils.getMonthNumberFromDate(
          preFactura.mesFacturacion
        );
        const nuevaFacturaId = await FacturaInfrastructureService.generaNumeroFactura(
          preFactura.merchant.id,
          anyoFacturacion
        );
        const insertRequest = new InsertFacturaRequest();
        insertRequest.numeroFactura = nuevaFacturaId;
        insertRequest.anyoFacturacion = anyoFacturacion;
        insertRequest.mesFacturacion = mesFacturacion;
        insertRequest.merchantId = preFactura.merchant.id;
        insertRequest.autonomoId = preFactura.autonomo.id;
        insertRequest.ticketsId = _.map(preFactura.tickets, ticket => {
          return ticket.id;
        });
        insertRequest.status = StatusFacturaEnum.NEW;
        insertRequest.tipo = '';
        await FacturaInfrastructureService.InsertFactura(insertRequest);
        // await PreFacturaInfrastructureService.deletePreFacturaById(
        //   preFactura.id
        // );
      } catch (error) {
        logger.error(
          `No se ha podido generar la factura para la prefactura: ${
            preFactura.id
          }`
        );
      }
    }
  } catch (error) {
    throw new Error(
      `Error on 'prepararFacturas.prepararFacturas': ${error.message}`
    );
  }
}

module.exports = { prepararFacturas };
