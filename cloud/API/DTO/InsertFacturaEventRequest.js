const FACTURA_EVENT_TYPE = { error: 'E', info: 'I' };

class InsertFacturaEventRequest {
  constructor() {
    this.facturaId = null;
    this.type = null;
    this.info = null;
    this.xMessageId = null;
  }
}

module.exports = { InsertFacturaEventRequest, FACTURA_EVENT_TYPE };
