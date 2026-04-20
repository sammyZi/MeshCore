import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace meshcore. */
export namespace meshcore {

    /** Properties of a LocationUpdate. */
    interface ILocationUpdate {

        /** LocationUpdate latI */
        latI?: (number|null);

        /** LocationUpdate lonI */
        lonI?: (number|null);

        /** LocationUpdate altitude */
        altitude?: (number|null);

        /** LocationUpdate accuracy */
        accuracy?: (number|null);

        /** LocationUpdate timestamp */
        timestamp?: (number|Long|null);

        /** LocationUpdate senderId */
        senderId?: (string|null);
    }

    /** Represents a LocationUpdate. */
    class LocationUpdate implements ILocationUpdate {

        /**
         * Constructs a new LocationUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: meshcore.ILocationUpdate);

        /** LocationUpdate latI. */
        public latI: number;

        /** LocationUpdate lonI. */
        public lonI: number;

        /** LocationUpdate altitude. */
        public altitude: number;

        /** LocationUpdate accuracy. */
        public accuracy: number;

        /** LocationUpdate timestamp. */
        public timestamp: (number|Long);

        /** LocationUpdate senderId. */
        public senderId: string;

        /**
         * Creates a new LocationUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LocationUpdate instance
         */
        public static create(properties?: meshcore.ILocationUpdate): meshcore.LocationUpdate;

        /**
         * Encodes the specified LocationUpdate message. Does not implicitly {@link meshcore.LocationUpdate.verify|verify} messages.
         * @param message LocationUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: meshcore.ILocationUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LocationUpdate message, length delimited. Does not implicitly {@link meshcore.LocationUpdate.verify|verify} messages.
         * @param message LocationUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: meshcore.ILocationUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LocationUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LocationUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): meshcore.LocationUpdate;

        /**
         * Decodes a LocationUpdate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LocationUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): meshcore.LocationUpdate;

        /**
         * Verifies a LocationUpdate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LocationUpdate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LocationUpdate
         */
        public static fromObject(object: { [k: string]: any }): meshcore.LocationUpdate;

        /**
         * Creates a plain object from a LocationUpdate message. Also converts values to other types if specified.
         * @param message LocationUpdate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: meshcore.LocationUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LocationUpdate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LocationUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TextMessage. */
    interface ITextMessage {

        /** TextMessage messageId */
        messageId?: (string|null);

        /** TextMessage senderId */
        senderId?: (string|null);

        /** TextMessage payload */
        payload?: (string|null);
    }

    /** Represents a TextMessage. */
    class TextMessage implements ITextMessage {

        /**
         * Constructs a new TextMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: meshcore.ITextMessage);

        /** TextMessage messageId. */
        public messageId: string;

        /** TextMessage senderId. */
        public senderId: string;

        /** TextMessage payload. */
        public payload: string;

        /**
         * Creates a new TextMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TextMessage instance
         */
        public static create(properties?: meshcore.ITextMessage): meshcore.TextMessage;

        /**
         * Encodes the specified TextMessage message. Does not implicitly {@link meshcore.TextMessage.verify|verify} messages.
         * @param message TextMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: meshcore.ITextMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TextMessage message, length delimited. Does not implicitly {@link meshcore.TextMessage.verify|verify} messages.
         * @param message TextMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: meshcore.ITextMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TextMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): meshcore.TextMessage;

        /**
         * Decodes a TextMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): meshcore.TextMessage;

        /**
         * Verifies a TextMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TextMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TextMessage
         */
        public static fromObject(object: { [k: string]: any }): meshcore.TextMessage;

        /**
         * Creates a plain object from a TextMessage message. Also converts values to other types if specified.
         * @param message TextMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: meshcore.TextMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TextMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for TextMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SOSAlert. */
    interface ISOSAlert {

        /** SOSAlert senderId */
        senderId?: (string|null);

        /** SOSAlert timestamp */
        timestamp?: (number|Long|null);

        /** SOSAlert signalType */
        signalType?: (number|null);
    }

    /** Represents a SOSAlert. */
    class SOSAlert implements ISOSAlert {

        /**
         * Constructs a new SOSAlert.
         * @param [properties] Properties to set
         */
        constructor(properties?: meshcore.ISOSAlert);

        /** SOSAlert senderId. */
        public senderId: string;

        /** SOSAlert timestamp. */
        public timestamp: (number|Long);

        /** SOSAlert signalType. */
        public signalType: number;

        /**
         * Creates a new SOSAlert instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SOSAlert instance
         */
        public static create(properties?: meshcore.ISOSAlert): meshcore.SOSAlert;

        /**
         * Encodes the specified SOSAlert message. Does not implicitly {@link meshcore.SOSAlert.verify|verify} messages.
         * @param message SOSAlert message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: meshcore.ISOSAlert, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SOSAlert message, length delimited. Does not implicitly {@link meshcore.SOSAlert.verify|verify} messages.
         * @param message SOSAlert message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: meshcore.ISOSAlert, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SOSAlert message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SOSAlert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): meshcore.SOSAlert;

        /**
         * Decodes a SOSAlert message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SOSAlert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): meshcore.SOSAlert;

        /**
         * Verifies a SOSAlert message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SOSAlert message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SOSAlert
         */
        public static fromObject(object: { [k: string]: any }): meshcore.SOSAlert;

        /**
         * Creates a plain object from a SOSAlert message. Also converts values to other types if specified.
         * @param message SOSAlert
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: meshcore.SOSAlert, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SOSAlert to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SOSAlert
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SystemSignal. */
    interface ISystemSignal {

        /** SystemSignal signalType */
        signalType?: (number|null);

        /** SystemSignal senderId */
        senderId?: (string|null);

        /** SystemSignal payload */
        payload?: (Uint8Array|null);
    }

    /** Represents a SystemSignal. */
    class SystemSignal implements ISystemSignal {

        /**
         * Constructs a new SystemSignal.
         * @param [properties] Properties to set
         */
        constructor(properties?: meshcore.ISystemSignal);

        /** SystemSignal signalType. */
        public signalType: number;

        /** SystemSignal senderId. */
        public senderId: string;

        /** SystemSignal payload. */
        public payload: Uint8Array;

        /**
         * Creates a new SystemSignal instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemSignal instance
         */
        public static create(properties?: meshcore.ISystemSignal): meshcore.SystemSignal;

        /**
         * Encodes the specified SystemSignal message. Does not implicitly {@link meshcore.SystemSignal.verify|verify} messages.
         * @param message SystemSignal message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: meshcore.ISystemSignal, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemSignal message, length delimited. Does not implicitly {@link meshcore.SystemSignal.verify|verify} messages.
         * @param message SystemSignal message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: meshcore.ISystemSignal, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemSignal message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemSignal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): meshcore.SystemSignal;

        /**
         * Decodes a SystemSignal message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemSignal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): meshcore.SystemSignal;

        /**
         * Verifies a SystemSignal message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemSignal message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemSignal
         */
        public static fromObject(object: { [k: string]: any }): meshcore.SystemSignal;

        /**
         * Creates a plain object from a SystemSignal message. Also converts values to other types if specified.
         * @param message SystemSignal
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: meshcore.SystemSignal, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemSignal to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SystemSignal
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MeshPacket. */
    interface IMeshPacket {

        /** MeshPacket packetId */
        packetId?: (string|null);

        /** MeshPacket seqNum */
        seqNum?: (number|null);

        /** MeshPacket ttl */
        ttl?: (number|null);

        /** MeshPacket priority */
        priority?: (number|null);

        /** MeshPacket packetType */
        packetType?: (number|null);

        /** MeshPacket payload */
        payload?: (Uint8Array|null);

        /** MeshPacket signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a MeshPacket. */
    class MeshPacket implements IMeshPacket {

        /**
         * Constructs a new MeshPacket.
         * @param [properties] Properties to set
         */
        constructor(properties?: meshcore.IMeshPacket);

        /** MeshPacket packetId. */
        public packetId: string;

        /** MeshPacket seqNum. */
        public seqNum: number;

        /** MeshPacket ttl. */
        public ttl: number;

        /** MeshPacket priority. */
        public priority: number;

        /** MeshPacket packetType. */
        public packetType: number;

        /** MeshPacket payload. */
        public payload: Uint8Array;

        /** MeshPacket signature. */
        public signature: Uint8Array;

        /**
         * Creates a new MeshPacket instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MeshPacket instance
         */
        public static create(properties?: meshcore.IMeshPacket): meshcore.MeshPacket;

        /**
         * Encodes the specified MeshPacket message. Does not implicitly {@link meshcore.MeshPacket.verify|verify} messages.
         * @param message MeshPacket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: meshcore.IMeshPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MeshPacket message, length delimited. Does not implicitly {@link meshcore.MeshPacket.verify|verify} messages.
         * @param message MeshPacket message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: meshcore.IMeshPacket, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MeshPacket message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MeshPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): meshcore.MeshPacket;

        /**
         * Decodes a MeshPacket message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MeshPacket
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): meshcore.MeshPacket;

        /**
         * Verifies a MeshPacket message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MeshPacket message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MeshPacket
         */
        public static fromObject(object: { [k: string]: any }): meshcore.MeshPacket;

        /**
         * Creates a plain object from a MeshPacket message. Also converts values to other types if specified.
         * @param message MeshPacket
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: meshcore.MeshPacket, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MeshPacket to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MeshPacket
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
