/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.meshcore = (function() {

    /**
     * Namespace meshcore.
     * @exports meshcore
     * @namespace
     */
    var meshcore = {};

    meshcore.LocationUpdate = (function() {

        /**
         * Properties of a LocationUpdate.
         * @memberof meshcore
         * @interface ILocationUpdate
         * @property {number|null} [latI] LocationUpdate latI
         * @property {number|null} [lonI] LocationUpdate lonI
         * @property {number|null} [altitude] LocationUpdate altitude
         * @property {number|null} [accuracy] LocationUpdate accuracy
         * @property {number|Long|null} [timestamp] LocationUpdate timestamp
         * @property {string|null} [senderId] LocationUpdate senderId
         */

        /**
         * Constructs a new LocationUpdate.
         * @memberof meshcore
         * @classdesc Represents a LocationUpdate.
         * @implements ILocationUpdate
         * @constructor
         * @param {meshcore.ILocationUpdate=} [properties] Properties to set
         */
        function LocationUpdate(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LocationUpdate latI.
         * @member {number} latI
         * @memberof meshcore.LocationUpdate
         * @instance
         */
        LocationUpdate.prototype.latI = 0;

        /**
         * LocationUpdate lonI.
         * @member {number} lonI
         * @memberof meshcore.LocationUpdate
         * @instance
         */
        LocationUpdate.prototype.lonI = 0;

        /**
         * LocationUpdate altitude.
         * @member {number} altitude
         * @memberof meshcore.LocationUpdate
         * @instance
         */
        LocationUpdate.prototype.altitude = 0;

        /**
         * LocationUpdate accuracy.
         * @member {number} accuracy
         * @memberof meshcore.LocationUpdate
         * @instance
         */
        LocationUpdate.prototype.accuracy = 0;

        /**
         * LocationUpdate timestamp.
         * @member {number|Long} timestamp
         * @memberof meshcore.LocationUpdate
         * @instance
         */
        LocationUpdate.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * LocationUpdate senderId.
         * @member {string} senderId
         * @memberof meshcore.LocationUpdate
         * @instance
         */
        LocationUpdate.prototype.senderId = "";

        /**
         * Creates a new LocationUpdate instance using the specified properties.
         * @function create
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {meshcore.ILocationUpdate=} [properties] Properties to set
         * @returns {meshcore.LocationUpdate} LocationUpdate instance
         */
        LocationUpdate.create = function create(properties) {
            return new LocationUpdate(properties);
        };

        /**
         * Encodes the specified LocationUpdate message. Does not implicitly {@link meshcore.LocationUpdate.verify|verify} messages.
         * @function encode
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {meshcore.ILocationUpdate} message LocationUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LocationUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.latI != null && Object.hasOwnProperty.call(message, "latI"))
                writer.uint32(/* id 1, wireType 5 =*/13).sfixed32(message.latI);
            if (message.lonI != null && Object.hasOwnProperty.call(message, "lonI"))
                writer.uint32(/* id 2, wireType 5 =*/21).sfixed32(message.lonI);
            if (message.altitude != null && Object.hasOwnProperty.call(message, "altitude"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.altitude);
            if (message.accuracy != null && Object.hasOwnProperty.call(message, "accuracy"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.accuracy);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.timestamp);
            if (message.senderId != null && Object.hasOwnProperty.call(message, "senderId"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.senderId);
            return writer;
        };

        /**
         * Encodes the specified LocationUpdate message, length delimited. Does not implicitly {@link meshcore.LocationUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {meshcore.ILocationUpdate} message LocationUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LocationUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LocationUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {meshcore.LocationUpdate} LocationUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LocationUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.meshcore.LocationUpdate();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.latI = reader.sfixed32();
                        break;
                    }
                case 2: {
                        message.lonI = reader.sfixed32();
                        break;
                    }
                case 3: {
                        message.altitude = reader.uint32();
                        break;
                    }
                case 4: {
                        message.accuracy = reader.uint32();
                        break;
                    }
                case 5: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 6: {
                        message.senderId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LocationUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {meshcore.LocationUpdate} LocationUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LocationUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LocationUpdate message.
         * @function verify
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LocationUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.latI != null && message.hasOwnProperty("latI"))
                if (!$util.isInteger(message.latI))
                    return "latI: integer expected";
            if (message.lonI != null && message.hasOwnProperty("lonI"))
                if (!$util.isInteger(message.lonI))
                    return "lonI: integer expected";
            if (message.altitude != null && message.hasOwnProperty("altitude"))
                if (!$util.isInteger(message.altitude))
                    return "altitude: integer expected";
            if (message.accuracy != null && message.hasOwnProperty("accuracy"))
                if (!$util.isInteger(message.accuracy))
                    return "accuracy: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                if (!$util.isString(message.senderId))
                    return "senderId: string expected";
            return null;
        };

        /**
         * Creates a LocationUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {meshcore.LocationUpdate} LocationUpdate
         */
        LocationUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.meshcore.LocationUpdate)
                return object;
            var message = new $root.meshcore.LocationUpdate();
            if (object.latI != null)
                message.latI = object.latI | 0;
            if (object.lonI != null)
                message.lonI = object.lonI | 0;
            if (object.altitude != null)
                message.altitude = object.altitude >>> 0;
            if (object.accuracy != null)
                message.accuracy = object.accuracy >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.senderId != null)
                message.senderId = String(object.senderId);
            return message;
        };

        /**
         * Creates a plain object from a LocationUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {meshcore.LocationUpdate} message LocationUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LocationUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.latI = 0;
                object.lonI = 0;
                object.altitude = 0;
                object.accuracy = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.senderId = "";
            }
            if (message.latI != null && message.hasOwnProperty("latI"))
                object.latI = message.latI;
            if (message.lonI != null && message.hasOwnProperty("lonI"))
                object.lonI = message.lonI;
            if (message.altitude != null && message.hasOwnProperty("altitude"))
                object.altitude = message.altitude;
            if (message.accuracy != null && message.hasOwnProperty("accuracy"))
                object.accuracy = message.accuracy;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                object.senderId = message.senderId;
            return object;
        };

        /**
         * Converts this LocationUpdate to JSON.
         * @function toJSON
         * @memberof meshcore.LocationUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LocationUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LocationUpdate
         * @function getTypeUrl
         * @memberof meshcore.LocationUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LocationUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/meshcore.LocationUpdate";
        };

        return LocationUpdate;
    })();

    meshcore.TextMessage = (function() {

        /**
         * Properties of a TextMessage.
         * @memberof meshcore
         * @interface ITextMessage
         * @property {string|null} [messageId] TextMessage messageId
         * @property {string|null} [senderId] TextMessage senderId
         * @property {string|null} [payload] TextMessage payload
         */

        /**
         * Constructs a new TextMessage.
         * @memberof meshcore
         * @classdesc Represents a TextMessage.
         * @implements ITextMessage
         * @constructor
         * @param {meshcore.ITextMessage=} [properties] Properties to set
         */
        function TextMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TextMessage messageId.
         * @member {string} messageId
         * @memberof meshcore.TextMessage
         * @instance
         */
        TextMessage.prototype.messageId = "";

        /**
         * TextMessage senderId.
         * @member {string} senderId
         * @memberof meshcore.TextMessage
         * @instance
         */
        TextMessage.prototype.senderId = "";

        /**
         * TextMessage payload.
         * @member {string} payload
         * @memberof meshcore.TextMessage
         * @instance
         */
        TextMessage.prototype.payload = "";

        /**
         * Creates a new TextMessage instance using the specified properties.
         * @function create
         * @memberof meshcore.TextMessage
         * @static
         * @param {meshcore.ITextMessage=} [properties] Properties to set
         * @returns {meshcore.TextMessage} TextMessage instance
         */
        TextMessage.create = function create(properties) {
            return new TextMessage(properties);
        };

        /**
         * Encodes the specified TextMessage message. Does not implicitly {@link meshcore.TextMessage.verify|verify} messages.
         * @function encode
         * @memberof meshcore.TextMessage
         * @static
         * @param {meshcore.ITextMessage} message TextMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TextMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
            if (message.senderId != null && Object.hasOwnProperty.call(message, "senderId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.senderId);
            if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.payload);
            return writer;
        };

        /**
         * Encodes the specified TextMessage message, length delimited. Does not implicitly {@link meshcore.TextMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof meshcore.TextMessage
         * @static
         * @param {meshcore.ITextMessage} message TextMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TextMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TextMessage message from the specified reader or buffer.
         * @function decode
         * @memberof meshcore.TextMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {meshcore.TextMessage} TextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TextMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.meshcore.TextMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.messageId = reader.string();
                        break;
                    }
                case 2: {
                        message.senderId = reader.string();
                        break;
                    }
                case 3: {
                        message.payload = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TextMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof meshcore.TextMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {meshcore.TextMessage} TextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TextMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TextMessage message.
         * @function verify
         * @memberof meshcore.TextMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TextMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                if (!$util.isString(message.messageId))
                    return "messageId: string expected";
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                if (!$util.isString(message.senderId))
                    return "senderId: string expected";
            if (message.payload != null && message.hasOwnProperty("payload"))
                if (!$util.isString(message.payload))
                    return "payload: string expected";
            return null;
        };

        /**
         * Creates a TextMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof meshcore.TextMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {meshcore.TextMessage} TextMessage
         */
        TextMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.meshcore.TextMessage)
                return object;
            var message = new $root.meshcore.TextMessage();
            if (object.messageId != null)
                message.messageId = String(object.messageId);
            if (object.senderId != null)
                message.senderId = String(object.senderId);
            if (object.payload != null)
                message.payload = String(object.payload);
            return message;
        };

        /**
         * Creates a plain object from a TextMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof meshcore.TextMessage
         * @static
         * @param {meshcore.TextMessage} message TextMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TextMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.messageId = "";
                object.senderId = "";
                object.payload = "";
            }
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                object.messageId = message.messageId;
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                object.senderId = message.senderId;
            if (message.payload != null && message.hasOwnProperty("payload"))
                object.payload = message.payload;
            return object;
        };

        /**
         * Converts this TextMessage to JSON.
         * @function toJSON
         * @memberof meshcore.TextMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TextMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TextMessage
         * @function getTypeUrl
         * @memberof meshcore.TextMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TextMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/meshcore.TextMessage";
        };

        return TextMessage;
    })();

    meshcore.SOSAlert = (function() {

        /**
         * Properties of a SOSAlert.
         * @memberof meshcore
         * @interface ISOSAlert
         * @property {string|null} [senderId] SOSAlert senderId
         * @property {number|Long|null} [timestamp] SOSAlert timestamp
         * @property {number|null} [signalType] SOSAlert signalType
         */

        /**
         * Constructs a new SOSAlert.
         * @memberof meshcore
         * @classdesc Represents a SOSAlert.
         * @implements ISOSAlert
         * @constructor
         * @param {meshcore.ISOSAlert=} [properties] Properties to set
         */
        function SOSAlert(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SOSAlert senderId.
         * @member {string} senderId
         * @memberof meshcore.SOSAlert
         * @instance
         */
        SOSAlert.prototype.senderId = "";

        /**
         * SOSAlert timestamp.
         * @member {number|Long} timestamp
         * @memberof meshcore.SOSAlert
         * @instance
         */
        SOSAlert.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * SOSAlert signalType.
         * @member {number} signalType
         * @memberof meshcore.SOSAlert
         * @instance
         */
        SOSAlert.prototype.signalType = 0;

        /**
         * Creates a new SOSAlert instance using the specified properties.
         * @function create
         * @memberof meshcore.SOSAlert
         * @static
         * @param {meshcore.ISOSAlert=} [properties] Properties to set
         * @returns {meshcore.SOSAlert} SOSAlert instance
         */
        SOSAlert.create = function create(properties) {
            return new SOSAlert(properties);
        };

        /**
         * Encodes the specified SOSAlert message. Does not implicitly {@link meshcore.SOSAlert.verify|verify} messages.
         * @function encode
         * @memberof meshcore.SOSAlert
         * @static
         * @param {meshcore.ISOSAlert} message SOSAlert message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SOSAlert.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderId != null && Object.hasOwnProperty.call(message, "senderId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.senderId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.signalType != null && Object.hasOwnProperty.call(message, "signalType"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.signalType);
            return writer;
        };

        /**
         * Encodes the specified SOSAlert message, length delimited. Does not implicitly {@link meshcore.SOSAlert.verify|verify} messages.
         * @function encodeDelimited
         * @memberof meshcore.SOSAlert
         * @static
         * @param {meshcore.ISOSAlert} message SOSAlert message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SOSAlert.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SOSAlert message from the specified reader or buffer.
         * @function decode
         * @memberof meshcore.SOSAlert
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {meshcore.SOSAlert} SOSAlert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SOSAlert.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.meshcore.SOSAlert();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.senderId = reader.string();
                        break;
                    }
                case 2: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 3: {
                        message.signalType = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SOSAlert message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof meshcore.SOSAlert
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {meshcore.SOSAlert} SOSAlert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SOSAlert.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SOSAlert message.
         * @function verify
         * @memberof meshcore.SOSAlert
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SOSAlert.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                if (!$util.isString(message.senderId))
                    return "senderId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.signalType != null && message.hasOwnProperty("signalType"))
                if (!$util.isInteger(message.signalType))
                    return "signalType: integer expected";
            return null;
        };

        /**
         * Creates a SOSAlert message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof meshcore.SOSAlert
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {meshcore.SOSAlert} SOSAlert
         */
        SOSAlert.fromObject = function fromObject(object) {
            if (object instanceof $root.meshcore.SOSAlert)
                return object;
            var message = new $root.meshcore.SOSAlert();
            if (object.senderId != null)
                message.senderId = String(object.senderId);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.signalType != null)
                message.signalType = object.signalType >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a SOSAlert message. Also converts values to other types if specified.
         * @function toObject
         * @memberof meshcore.SOSAlert
         * @static
         * @param {meshcore.SOSAlert} message SOSAlert
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SOSAlert.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.senderId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.signalType = 0;
            }
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                object.senderId = message.senderId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.signalType != null && message.hasOwnProperty("signalType"))
                object.signalType = message.signalType;
            return object;
        };

        /**
         * Converts this SOSAlert to JSON.
         * @function toJSON
         * @memberof meshcore.SOSAlert
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SOSAlert.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SOSAlert
         * @function getTypeUrl
         * @memberof meshcore.SOSAlert
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SOSAlert.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/meshcore.SOSAlert";
        };

        return SOSAlert;
    })();

    meshcore.SystemSignal = (function() {

        /**
         * Properties of a SystemSignal.
         * @memberof meshcore
         * @interface ISystemSignal
         * @property {number|null} [signalType] SystemSignal signalType
         * @property {string|null} [senderId] SystemSignal senderId
         * @property {Uint8Array|null} [payload] SystemSignal payload
         */

        /**
         * Constructs a new SystemSignal.
         * @memberof meshcore
         * @classdesc Represents a SystemSignal.
         * @implements ISystemSignal
         * @constructor
         * @param {meshcore.ISystemSignal=} [properties] Properties to set
         */
        function SystemSignal(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemSignal signalType.
         * @member {number} signalType
         * @memberof meshcore.SystemSignal
         * @instance
         */
        SystemSignal.prototype.signalType = 0;

        /**
         * SystemSignal senderId.
         * @member {string} senderId
         * @memberof meshcore.SystemSignal
         * @instance
         */
        SystemSignal.prototype.senderId = "";

        /**
         * SystemSignal payload.
         * @member {Uint8Array} payload
         * @memberof meshcore.SystemSignal
         * @instance
         */
        SystemSignal.prototype.payload = $util.newBuffer([]);

        /**
         * Creates a new SystemSignal instance using the specified properties.
         * @function create
         * @memberof meshcore.SystemSignal
         * @static
         * @param {meshcore.ISystemSignal=} [properties] Properties to set
         * @returns {meshcore.SystemSignal} SystemSignal instance
         */
        SystemSignal.create = function create(properties) {
            return new SystemSignal(properties);
        };

        /**
         * Encodes the specified SystemSignal message. Does not implicitly {@link meshcore.SystemSignal.verify|verify} messages.
         * @function encode
         * @memberof meshcore.SystemSignal
         * @static
         * @param {meshcore.ISystemSignal} message SystemSignal message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemSignal.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signalType != null && Object.hasOwnProperty.call(message, "signalType"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.signalType);
            if (message.senderId != null && Object.hasOwnProperty.call(message, "senderId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.senderId);
            if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.payload);
            return writer;
        };

        /**
         * Encodes the specified SystemSignal message, length delimited. Does not implicitly {@link meshcore.SystemSignal.verify|verify} messages.
         * @function encodeDelimited
         * @memberof meshcore.SystemSignal
         * @static
         * @param {meshcore.ISystemSignal} message SystemSignal message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemSignal.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SystemSignal message from the specified reader or buffer.
         * @function decode
         * @memberof meshcore.SystemSignal
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {meshcore.SystemSignal} SystemSignal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemSignal.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.meshcore.SystemSignal();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.signalType = reader.uint32();
                        break;
                    }
                case 2: {
                        message.senderId = reader.string();
                        break;
                    }
                case 3: {
                        message.payload = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemSignal message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof meshcore.SystemSignal
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {meshcore.SystemSignal} SystemSignal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemSignal.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemSignal message.
         * @function verify
         * @memberof meshcore.SystemSignal
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemSignal.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signalType != null && message.hasOwnProperty("signalType"))
                if (!$util.isInteger(message.signalType))
                    return "signalType: integer expected";
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                if (!$util.isString(message.senderId))
                    return "senderId: string expected";
            if (message.payload != null && message.hasOwnProperty("payload"))
                if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                    return "payload: buffer expected";
            return null;
        };

        /**
         * Creates a SystemSignal message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof meshcore.SystemSignal
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {meshcore.SystemSignal} SystemSignal
         */
        SystemSignal.fromObject = function fromObject(object) {
            if (object instanceof $root.meshcore.SystemSignal)
                return object;
            var message = new $root.meshcore.SystemSignal();
            if (object.signalType != null)
                message.signalType = object.signalType >>> 0;
            if (object.senderId != null)
                message.senderId = String(object.senderId);
            if (object.payload != null)
                if (typeof object.payload === "string")
                    $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                else if (object.payload.length >= 0)
                    message.payload = object.payload;
            return message;
        };

        /**
         * Creates a plain object from a SystemSignal message. Also converts values to other types if specified.
         * @function toObject
         * @memberof meshcore.SystemSignal
         * @static
         * @param {meshcore.SystemSignal} message SystemSignal
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemSignal.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.signalType = 0;
                object.senderId = "";
                if (options.bytes === String)
                    object.payload = "";
                else {
                    object.payload = [];
                    if (options.bytes !== Array)
                        object.payload = $util.newBuffer(object.payload);
                }
            }
            if (message.signalType != null && message.hasOwnProperty("signalType"))
                object.signalType = message.signalType;
            if (message.senderId != null && message.hasOwnProperty("senderId"))
                object.senderId = message.senderId;
            if (message.payload != null && message.hasOwnProperty("payload"))
                object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
            return object;
        };

        /**
         * Converts this SystemSignal to JSON.
         * @function toJSON
         * @memberof meshcore.SystemSignal
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemSignal.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SystemSignal
         * @function getTypeUrl
         * @memberof meshcore.SystemSignal
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SystemSignal.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/meshcore.SystemSignal";
        };

        return SystemSignal;
    })();

    meshcore.MeshPacket = (function() {

        /**
         * Properties of a MeshPacket.
         * @memberof meshcore
         * @interface IMeshPacket
         * @property {string|null} [packetId] MeshPacket packetId
         * @property {number|null} [seqNum] MeshPacket seqNum
         * @property {number|null} [ttl] MeshPacket ttl
         * @property {number|null} [priority] MeshPacket priority
         * @property {number|null} [packetType] MeshPacket packetType
         * @property {Uint8Array|null} [payload] MeshPacket payload
         * @property {Uint8Array|null} [signature] MeshPacket signature
         */

        /**
         * Constructs a new MeshPacket.
         * @memberof meshcore
         * @classdesc Represents a MeshPacket.
         * @implements IMeshPacket
         * @constructor
         * @param {meshcore.IMeshPacket=} [properties] Properties to set
         */
        function MeshPacket(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MeshPacket packetId.
         * @member {string} packetId
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.packetId = "";

        /**
         * MeshPacket seqNum.
         * @member {number} seqNum
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.seqNum = 0;

        /**
         * MeshPacket ttl.
         * @member {number} ttl
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.ttl = 0;

        /**
         * MeshPacket priority.
         * @member {number} priority
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.priority = 0;

        /**
         * MeshPacket packetType.
         * @member {number} packetType
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.packetType = 0;

        /**
         * MeshPacket payload.
         * @member {Uint8Array} payload
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.payload = $util.newBuffer([]);

        /**
         * MeshPacket signature.
         * @member {Uint8Array} signature
         * @memberof meshcore.MeshPacket
         * @instance
         */
        MeshPacket.prototype.signature = $util.newBuffer([]);

        /**
         * Creates a new MeshPacket instance using the specified properties.
         * @function create
         * @memberof meshcore.MeshPacket
         * @static
         * @param {meshcore.IMeshPacket=} [properties] Properties to set
         * @returns {meshcore.MeshPacket} MeshPacket instance
         */
        MeshPacket.create = function create(properties) {
            return new MeshPacket(properties);
        };

        /**
         * Encodes the specified MeshPacket message. Does not implicitly {@link meshcore.MeshPacket.verify|verify} messages.
         * @function encode
         * @memberof meshcore.MeshPacket
         * @static
         * @param {meshcore.IMeshPacket} message MeshPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MeshPacket.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.packetId != null && Object.hasOwnProperty.call(message, "packetId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.packetId);
            if (message.seqNum != null && Object.hasOwnProperty.call(message, "seqNum"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.seqNum);
            if (message.ttl != null && Object.hasOwnProperty.call(message, "ttl"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.ttl);
            if (message.priority != null && Object.hasOwnProperty.call(message, "priority"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.priority);
            if (message.packetType != null && Object.hasOwnProperty.call(message, "packetType"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.packetType);
            if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.payload);
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.signature);
            return writer;
        };

        /**
         * Encodes the specified MeshPacket message, length delimited. Does not implicitly {@link meshcore.MeshPacket.verify|verify} messages.
         * @function encodeDelimited
         * @memberof meshcore.MeshPacket
         * @static
         * @param {meshcore.IMeshPacket} message MeshPacket message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MeshPacket.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MeshPacket message from the specified reader or buffer.
         * @function decode
         * @memberof meshcore.MeshPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {meshcore.MeshPacket} MeshPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MeshPacket.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.meshcore.MeshPacket();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.packetId = reader.string();
                        break;
                    }
                case 2: {
                        message.seqNum = reader.uint32();
                        break;
                    }
                case 3: {
                        message.ttl = reader.uint32();
                        break;
                    }
                case 4: {
                        message.priority = reader.uint32();
                        break;
                    }
                case 5: {
                        message.packetType = reader.uint32();
                        break;
                    }
                case 6: {
                        message.payload = reader.bytes();
                        break;
                    }
                case 7: {
                        message.signature = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MeshPacket message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof meshcore.MeshPacket
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {meshcore.MeshPacket} MeshPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MeshPacket.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MeshPacket message.
         * @function verify
         * @memberof meshcore.MeshPacket
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MeshPacket.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.packetId != null && message.hasOwnProperty("packetId"))
                if (!$util.isString(message.packetId))
                    return "packetId: string expected";
            if (message.seqNum != null && message.hasOwnProperty("seqNum"))
                if (!$util.isInteger(message.seqNum))
                    return "seqNum: integer expected";
            if (message.ttl != null && message.hasOwnProperty("ttl"))
                if (!$util.isInteger(message.ttl))
                    return "ttl: integer expected";
            if (message.priority != null && message.hasOwnProperty("priority"))
                if (!$util.isInteger(message.priority))
                    return "priority: integer expected";
            if (message.packetType != null && message.hasOwnProperty("packetType"))
                if (!$util.isInteger(message.packetType))
                    return "packetType: integer expected";
            if (message.payload != null && message.hasOwnProperty("payload"))
                if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                    return "payload: buffer expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                    return "signature: buffer expected";
            return null;
        };

        /**
         * Creates a MeshPacket message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof meshcore.MeshPacket
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {meshcore.MeshPacket} MeshPacket
         */
        MeshPacket.fromObject = function fromObject(object) {
            if (object instanceof $root.meshcore.MeshPacket)
                return object;
            var message = new $root.meshcore.MeshPacket();
            if (object.packetId != null)
                message.packetId = String(object.packetId);
            if (object.seqNum != null)
                message.seqNum = object.seqNum >>> 0;
            if (object.ttl != null)
                message.ttl = object.ttl >>> 0;
            if (object.priority != null)
                message.priority = object.priority >>> 0;
            if (object.packetType != null)
                message.packetType = object.packetType >>> 0;
            if (object.payload != null)
                if (typeof object.payload === "string")
                    $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                else if (object.payload.length >= 0)
                    message.payload = object.payload;
            if (object.signature != null)
                if (typeof object.signature === "string")
                    $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                else if (object.signature.length >= 0)
                    message.signature = object.signature;
            return message;
        };

        /**
         * Creates a plain object from a MeshPacket message. Also converts values to other types if specified.
         * @function toObject
         * @memberof meshcore.MeshPacket
         * @static
         * @param {meshcore.MeshPacket} message MeshPacket
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MeshPacket.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.packetId = "";
                object.seqNum = 0;
                object.ttl = 0;
                object.priority = 0;
                object.packetType = 0;
                if (options.bytes === String)
                    object.payload = "";
                else {
                    object.payload = [];
                    if (options.bytes !== Array)
                        object.payload = $util.newBuffer(object.payload);
                }
                if (options.bytes === String)
                    object.signature = "";
                else {
                    object.signature = [];
                    if (options.bytes !== Array)
                        object.signature = $util.newBuffer(object.signature);
                }
            }
            if (message.packetId != null && message.hasOwnProperty("packetId"))
                object.packetId = message.packetId;
            if (message.seqNum != null && message.hasOwnProperty("seqNum"))
                object.seqNum = message.seqNum;
            if (message.ttl != null && message.hasOwnProperty("ttl"))
                object.ttl = message.ttl;
            if (message.priority != null && message.hasOwnProperty("priority"))
                object.priority = message.priority;
            if (message.packetType != null && message.hasOwnProperty("packetType"))
                object.packetType = message.packetType;
            if (message.payload != null && message.hasOwnProperty("payload"))
                object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            return object;
        };

        /**
         * Converts this MeshPacket to JSON.
         * @function toJSON
         * @memberof meshcore.MeshPacket
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MeshPacket.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MeshPacket
         * @function getTypeUrl
         * @memberof meshcore.MeshPacket
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MeshPacket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/meshcore.MeshPacket";
        };

        return MeshPacket;
    })();

    return meshcore;
})();

module.exports = $root;
