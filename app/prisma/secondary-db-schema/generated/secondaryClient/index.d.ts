
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Algorithm
 * 
 */
export type Algorithm = $Result.DefaultSelection<Prisma.$AlgorithmPayload>
/**
 * Model AlgorithmCode
 * 
 */
export type AlgorithmCode = $Result.DefaultSelection<Prisma.$AlgorithmCodePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Algorithms
 * const algorithms = await prisma.algorithm.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Algorithms
   * const algorithms = await prisma.algorithm.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.algorithm`: Exposes CRUD operations for the **Algorithm** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Algorithms
    * const algorithms = await prisma.algorithm.findMany()
    * ```
    */
  get algorithm(): Prisma.AlgorithmDelegate<ExtArgs>;

  /**
   * `prisma.algorithmCode`: Exposes CRUD operations for the **AlgorithmCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlgorithmCodes
    * const algorithmCodes = await prisma.algorithmCode.findMany()
    * ```
    */
  get algorithmCode(): Prisma.AlgorithmCodeDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.17.0
   * Query Engine version: 393aa359c9ad4a4bb28630fb5613f9c281cde053
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Algorithm: 'Algorithm',
    AlgorithmCode: 'AlgorithmCode'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    dbSecondary?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "algorithm" | "algorithmCode"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Algorithm: {
        payload: Prisma.$AlgorithmPayload<ExtArgs>
        fields: Prisma.AlgorithmFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlgorithmFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlgorithmFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>
          }
          findFirst: {
            args: Prisma.AlgorithmFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlgorithmFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>
          }
          findMany: {
            args: Prisma.AlgorithmFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>[]
          }
          create: {
            args: Prisma.AlgorithmCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>
          }
          createMany: {
            args: Prisma.AlgorithmCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlgorithmCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>[]
          }
          delete: {
            args: Prisma.AlgorithmDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>
          }
          update: {
            args: Prisma.AlgorithmUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>
          }
          deleteMany: {
            args: Prisma.AlgorithmDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlgorithmUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlgorithmUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmPayload>
          }
          aggregate: {
            args: Prisma.AlgorithmAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlgorithm>
          }
          groupBy: {
            args: Prisma.AlgorithmGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlgorithmGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlgorithmCountArgs<ExtArgs>
            result: $Utils.Optional<AlgorithmCountAggregateOutputType> | number
          }
        }
      }
      AlgorithmCode: {
        payload: Prisma.$AlgorithmCodePayload<ExtArgs>
        fields: Prisma.AlgorithmCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlgorithmCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlgorithmCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>
          }
          findFirst: {
            args: Prisma.AlgorithmCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlgorithmCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>
          }
          findMany: {
            args: Prisma.AlgorithmCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>[]
          }
          create: {
            args: Prisma.AlgorithmCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>
          }
          createMany: {
            args: Prisma.AlgorithmCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlgorithmCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>[]
          }
          delete: {
            args: Prisma.AlgorithmCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>
          }
          update: {
            args: Prisma.AlgorithmCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>
          }
          deleteMany: {
            args: Prisma.AlgorithmCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlgorithmCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlgorithmCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlgorithmCodePayload>
          }
          aggregate: {
            args: Prisma.AlgorithmCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlgorithmCode>
          }
          groupBy: {
            args: Prisma.AlgorithmCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlgorithmCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlgorithmCodeCountArgs<ExtArgs>
            result: $Utils.Optional<AlgorithmCodeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AlgorithmCountOutputType
   */

  export type AlgorithmCountOutputType = {
    codes: number
  }

  export type AlgorithmCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    codes?: boolean | AlgorithmCountOutputTypeCountCodesArgs
  }

  // Custom InputTypes
  /**
   * AlgorithmCountOutputType without action
   */
  export type AlgorithmCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCountOutputType
     */
    select?: AlgorithmCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlgorithmCountOutputType without action
   */
  export type AlgorithmCountOutputTypeCountCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlgorithmCodeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Algorithm
   */

  export type AggregateAlgorithm = {
    _count: AlgorithmCountAggregateOutputType | null
    _avg: AlgorithmAvgAggregateOutputType | null
    _sum: AlgorithmSumAggregateOutputType | null
    _min: AlgorithmMinAggregateOutputType | null
    _max: AlgorithmMaxAggregateOutputType | null
  }

  export type AlgorithmAvgAggregateOutputType = {
    id: number | null
  }

  export type AlgorithmSumAggregateOutputType = {
    id: number | null
  }

  export type AlgorithmMinAggregateOutputType = {
    id: number | null
    key: string | null
    name: string | null
    description: string | null
    worstCase: string | null
    bestCase: string | null
    averageCase: string | null
    spaceComplexity: string | null
    metadataName: string | null
    metadataDescription: string | null
    metadataImage: string | null
    metadataRoute: string | null
  }

  export type AlgorithmMaxAggregateOutputType = {
    id: number | null
    key: string | null
    name: string | null
    description: string | null
    worstCase: string | null
    bestCase: string | null
    averageCase: string | null
    spaceComplexity: string | null
    metadataName: string | null
    metadataDescription: string | null
    metadataImage: string | null
    metadataRoute: string | null
  }

  export type AlgorithmCountAggregateOutputType = {
    id: number
    key: number
    name: number
    description: number
    steps: number
    keyConcepts: number
    worstCase: number
    bestCase: number
    averageCase: number
    spaceComplexity: number
    advantages: number
    disadvantages: number
    practicalUse: number
    metadataName: number
    metadataDescription: number
    metadataImage: number
    metadataRoute: number
    _all: number
  }


  export type AlgorithmAvgAggregateInputType = {
    id?: true
  }

  export type AlgorithmSumAggregateInputType = {
    id?: true
  }

  export type AlgorithmMinAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    worstCase?: true
    bestCase?: true
    averageCase?: true
    spaceComplexity?: true
    metadataName?: true
    metadataDescription?: true
    metadataImage?: true
    metadataRoute?: true
  }

  export type AlgorithmMaxAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    worstCase?: true
    bestCase?: true
    averageCase?: true
    spaceComplexity?: true
    metadataName?: true
    metadataDescription?: true
    metadataImage?: true
    metadataRoute?: true
  }

  export type AlgorithmCountAggregateInputType = {
    id?: true
    key?: true
    name?: true
    description?: true
    steps?: true
    keyConcepts?: true
    worstCase?: true
    bestCase?: true
    averageCase?: true
    spaceComplexity?: true
    advantages?: true
    disadvantages?: true
    practicalUse?: true
    metadataName?: true
    metadataDescription?: true
    metadataImage?: true
    metadataRoute?: true
    _all?: true
  }

  export type AlgorithmAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Algorithm to aggregate.
     */
    where?: AlgorithmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Algorithms to fetch.
     */
    orderBy?: AlgorithmOrderByWithRelationInput | AlgorithmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlgorithmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Algorithms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Algorithms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Algorithms
    **/
    _count?: true | AlgorithmCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlgorithmAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlgorithmSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlgorithmMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlgorithmMaxAggregateInputType
  }

  export type GetAlgorithmAggregateType<T extends AlgorithmAggregateArgs> = {
        [P in keyof T & keyof AggregateAlgorithm]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlgorithm[P]>
      : GetScalarType<T[P], AggregateAlgorithm[P]>
  }




  export type AlgorithmGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlgorithmWhereInput
    orderBy?: AlgorithmOrderByWithAggregationInput | AlgorithmOrderByWithAggregationInput[]
    by: AlgorithmScalarFieldEnum[] | AlgorithmScalarFieldEnum
    having?: AlgorithmScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlgorithmCountAggregateInputType | true
    _avg?: AlgorithmAvgAggregateInputType
    _sum?: AlgorithmSumAggregateInputType
    _min?: AlgorithmMinAggregateInputType
    _max?: AlgorithmMaxAggregateInputType
  }

  export type AlgorithmGroupByOutputType = {
    id: number
    key: string
    name: string
    description: string
    steps: string[]
    keyConcepts: string[]
    worstCase: string
    bestCase: string
    averageCase: string
    spaceComplexity: string
    advantages: string[]
    disadvantages: string[]
    practicalUse: string[]
    metadataName: string
    metadataDescription: string
    metadataImage: string
    metadataRoute: string
    _count: AlgorithmCountAggregateOutputType | null
    _avg: AlgorithmAvgAggregateOutputType | null
    _sum: AlgorithmSumAggregateOutputType | null
    _min: AlgorithmMinAggregateOutputType | null
    _max: AlgorithmMaxAggregateOutputType | null
  }

  type GetAlgorithmGroupByPayload<T extends AlgorithmGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlgorithmGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlgorithmGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlgorithmGroupByOutputType[P]>
            : GetScalarType<T[P], AlgorithmGroupByOutputType[P]>
        }
      >
    >


  export type AlgorithmSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    steps?: boolean
    keyConcepts?: boolean
    worstCase?: boolean
    bestCase?: boolean
    averageCase?: boolean
    spaceComplexity?: boolean
    advantages?: boolean
    disadvantages?: boolean
    practicalUse?: boolean
    metadataName?: boolean
    metadataDescription?: boolean
    metadataImage?: boolean
    metadataRoute?: boolean
    codes?: boolean | Algorithm$codesArgs<ExtArgs>
    _count?: boolean | AlgorithmCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["algorithm"]>

  export type AlgorithmSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    steps?: boolean
    keyConcepts?: boolean
    worstCase?: boolean
    bestCase?: boolean
    averageCase?: boolean
    spaceComplexity?: boolean
    advantages?: boolean
    disadvantages?: boolean
    practicalUse?: boolean
    metadataName?: boolean
    metadataDescription?: boolean
    metadataImage?: boolean
    metadataRoute?: boolean
  }, ExtArgs["result"]["algorithm"]>

  export type AlgorithmSelectScalar = {
    id?: boolean
    key?: boolean
    name?: boolean
    description?: boolean
    steps?: boolean
    keyConcepts?: boolean
    worstCase?: boolean
    bestCase?: boolean
    averageCase?: boolean
    spaceComplexity?: boolean
    advantages?: boolean
    disadvantages?: boolean
    practicalUse?: boolean
    metadataName?: boolean
    metadataDescription?: boolean
    metadataImage?: boolean
    metadataRoute?: boolean
  }

  export type AlgorithmInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    codes?: boolean | Algorithm$codesArgs<ExtArgs>
    _count?: boolean | AlgorithmCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlgorithmIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AlgorithmPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Algorithm"
    objects: {
      codes: Prisma.$AlgorithmCodePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      key: string
      name: string
      description: string
      steps: string[]
      keyConcepts: string[]
      worstCase: string
      bestCase: string
      averageCase: string
      spaceComplexity: string
      advantages: string[]
      disadvantages: string[]
      practicalUse: string[]
      metadataName: string
      metadataDescription: string
      metadataImage: string
      metadataRoute: string
    }, ExtArgs["result"]["algorithm"]>
    composites: {}
  }

  type AlgorithmGetPayload<S extends boolean | null | undefined | AlgorithmDefaultArgs> = $Result.GetResult<Prisma.$AlgorithmPayload, S>

  type AlgorithmCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlgorithmFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlgorithmCountAggregateInputType | true
    }

  export interface AlgorithmDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Algorithm'], meta: { name: 'Algorithm' } }
    /**
     * Find zero or one Algorithm that matches the filter.
     * @param {AlgorithmFindUniqueArgs} args - Arguments to find a Algorithm
     * @example
     * // Get one Algorithm
     * const algorithm = await prisma.algorithm.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlgorithmFindUniqueArgs>(args: SelectSubset<T, AlgorithmFindUniqueArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Algorithm that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlgorithmFindUniqueOrThrowArgs} args - Arguments to find a Algorithm
     * @example
     * // Get one Algorithm
     * const algorithm = await prisma.algorithm.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlgorithmFindUniqueOrThrowArgs>(args: SelectSubset<T, AlgorithmFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Algorithm that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmFindFirstArgs} args - Arguments to find a Algorithm
     * @example
     * // Get one Algorithm
     * const algorithm = await prisma.algorithm.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlgorithmFindFirstArgs>(args?: SelectSubset<T, AlgorithmFindFirstArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Algorithm that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmFindFirstOrThrowArgs} args - Arguments to find a Algorithm
     * @example
     * // Get one Algorithm
     * const algorithm = await prisma.algorithm.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlgorithmFindFirstOrThrowArgs>(args?: SelectSubset<T, AlgorithmFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Algorithms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Algorithms
     * const algorithms = await prisma.algorithm.findMany()
     * 
     * // Get first 10 Algorithms
     * const algorithms = await prisma.algorithm.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const algorithmWithIdOnly = await prisma.algorithm.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlgorithmFindManyArgs>(args?: SelectSubset<T, AlgorithmFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Algorithm.
     * @param {AlgorithmCreateArgs} args - Arguments to create a Algorithm.
     * @example
     * // Create one Algorithm
     * const Algorithm = await prisma.algorithm.create({
     *   data: {
     *     // ... data to create a Algorithm
     *   }
     * })
     * 
     */
    create<T extends AlgorithmCreateArgs>(args: SelectSubset<T, AlgorithmCreateArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Algorithms.
     * @param {AlgorithmCreateManyArgs} args - Arguments to create many Algorithms.
     * @example
     * // Create many Algorithms
     * const algorithm = await prisma.algorithm.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlgorithmCreateManyArgs>(args?: SelectSubset<T, AlgorithmCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Algorithms and returns the data saved in the database.
     * @param {AlgorithmCreateManyAndReturnArgs} args - Arguments to create many Algorithms.
     * @example
     * // Create many Algorithms
     * const algorithm = await prisma.algorithm.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Algorithms and only return the `id`
     * const algorithmWithIdOnly = await prisma.algorithm.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlgorithmCreateManyAndReturnArgs>(args?: SelectSubset<T, AlgorithmCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Algorithm.
     * @param {AlgorithmDeleteArgs} args - Arguments to delete one Algorithm.
     * @example
     * // Delete one Algorithm
     * const Algorithm = await prisma.algorithm.delete({
     *   where: {
     *     // ... filter to delete one Algorithm
     *   }
     * })
     * 
     */
    delete<T extends AlgorithmDeleteArgs>(args: SelectSubset<T, AlgorithmDeleteArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Algorithm.
     * @param {AlgorithmUpdateArgs} args - Arguments to update one Algorithm.
     * @example
     * // Update one Algorithm
     * const algorithm = await prisma.algorithm.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlgorithmUpdateArgs>(args: SelectSubset<T, AlgorithmUpdateArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Algorithms.
     * @param {AlgorithmDeleteManyArgs} args - Arguments to filter Algorithms to delete.
     * @example
     * // Delete a few Algorithms
     * const { count } = await prisma.algorithm.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlgorithmDeleteManyArgs>(args?: SelectSubset<T, AlgorithmDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Algorithms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Algorithms
     * const algorithm = await prisma.algorithm.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlgorithmUpdateManyArgs>(args: SelectSubset<T, AlgorithmUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Algorithm.
     * @param {AlgorithmUpsertArgs} args - Arguments to update or create a Algorithm.
     * @example
     * // Update or create a Algorithm
     * const algorithm = await prisma.algorithm.upsert({
     *   create: {
     *     // ... data to create a Algorithm
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Algorithm we want to update
     *   }
     * })
     */
    upsert<T extends AlgorithmUpsertArgs>(args: SelectSubset<T, AlgorithmUpsertArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Algorithms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCountArgs} args - Arguments to filter Algorithms to count.
     * @example
     * // Count the number of Algorithms
     * const count = await prisma.algorithm.count({
     *   where: {
     *     // ... the filter for the Algorithms we want to count
     *   }
     * })
    **/
    count<T extends AlgorithmCountArgs>(
      args?: Subset<T, AlgorithmCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlgorithmCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Algorithm.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlgorithmAggregateArgs>(args: Subset<T, AlgorithmAggregateArgs>): Prisma.PrismaPromise<GetAlgorithmAggregateType<T>>

    /**
     * Group by Algorithm.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlgorithmGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlgorithmGroupByArgs['orderBy'] }
        : { orderBy?: AlgorithmGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlgorithmGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlgorithmGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Algorithm model
   */
  readonly fields: AlgorithmFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Algorithm.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlgorithmClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    codes<T extends Algorithm$codesArgs<ExtArgs> = {}>(args?: Subset<T, Algorithm$codesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Algorithm model
   */ 
  interface AlgorithmFieldRefs {
    readonly id: FieldRef<"Algorithm", 'Int'>
    readonly key: FieldRef<"Algorithm", 'String'>
    readonly name: FieldRef<"Algorithm", 'String'>
    readonly description: FieldRef<"Algorithm", 'String'>
    readonly steps: FieldRef<"Algorithm", 'String[]'>
    readonly keyConcepts: FieldRef<"Algorithm", 'String[]'>
    readonly worstCase: FieldRef<"Algorithm", 'String'>
    readonly bestCase: FieldRef<"Algorithm", 'String'>
    readonly averageCase: FieldRef<"Algorithm", 'String'>
    readonly spaceComplexity: FieldRef<"Algorithm", 'String'>
    readonly advantages: FieldRef<"Algorithm", 'String[]'>
    readonly disadvantages: FieldRef<"Algorithm", 'String[]'>
    readonly practicalUse: FieldRef<"Algorithm", 'String[]'>
    readonly metadataName: FieldRef<"Algorithm", 'String'>
    readonly metadataDescription: FieldRef<"Algorithm", 'String'>
    readonly metadataImage: FieldRef<"Algorithm", 'String'>
    readonly metadataRoute: FieldRef<"Algorithm", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Algorithm findUnique
   */
  export type AlgorithmFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * Filter, which Algorithm to fetch.
     */
    where: AlgorithmWhereUniqueInput
  }

  /**
   * Algorithm findUniqueOrThrow
   */
  export type AlgorithmFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * Filter, which Algorithm to fetch.
     */
    where: AlgorithmWhereUniqueInput
  }

  /**
   * Algorithm findFirst
   */
  export type AlgorithmFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * Filter, which Algorithm to fetch.
     */
    where?: AlgorithmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Algorithms to fetch.
     */
    orderBy?: AlgorithmOrderByWithRelationInput | AlgorithmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Algorithms.
     */
    cursor?: AlgorithmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Algorithms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Algorithms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Algorithms.
     */
    distinct?: AlgorithmScalarFieldEnum | AlgorithmScalarFieldEnum[]
  }

  /**
   * Algorithm findFirstOrThrow
   */
  export type AlgorithmFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * Filter, which Algorithm to fetch.
     */
    where?: AlgorithmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Algorithms to fetch.
     */
    orderBy?: AlgorithmOrderByWithRelationInput | AlgorithmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Algorithms.
     */
    cursor?: AlgorithmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Algorithms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Algorithms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Algorithms.
     */
    distinct?: AlgorithmScalarFieldEnum | AlgorithmScalarFieldEnum[]
  }

  /**
   * Algorithm findMany
   */
  export type AlgorithmFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * Filter, which Algorithms to fetch.
     */
    where?: AlgorithmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Algorithms to fetch.
     */
    orderBy?: AlgorithmOrderByWithRelationInput | AlgorithmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Algorithms.
     */
    cursor?: AlgorithmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Algorithms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Algorithms.
     */
    skip?: number
    distinct?: AlgorithmScalarFieldEnum | AlgorithmScalarFieldEnum[]
  }

  /**
   * Algorithm create
   */
  export type AlgorithmCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * The data needed to create a Algorithm.
     */
    data: XOR<AlgorithmCreateInput, AlgorithmUncheckedCreateInput>
  }

  /**
   * Algorithm createMany
   */
  export type AlgorithmCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Algorithms.
     */
    data: AlgorithmCreateManyInput | AlgorithmCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Algorithm createManyAndReturn
   */
  export type AlgorithmCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Algorithms.
     */
    data: AlgorithmCreateManyInput | AlgorithmCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Algorithm update
   */
  export type AlgorithmUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * The data needed to update a Algorithm.
     */
    data: XOR<AlgorithmUpdateInput, AlgorithmUncheckedUpdateInput>
    /**
     * Choose, which Algorithm to update.
     */
    where: AlgorithmWhereUniqueInput
  }

  /**
   * Algorithm updateMany
   */
  export type AlgorithmUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Algorithms.
     */
    data: XOR<AlgorithmUpdateManyMutationInput, AlgorithmUncheckedUpdateManyInput>
    /**
     * Filter which Algorithms to update
     */
    where?: AlgorithmWhereInput
  }

  /**
   * Algorithm upsert
   */
  export type AlgorithmUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * The filter to search for the Algorithm to update in case it exists.
     */
    where: AlgorithmWhereUniqueInput
    /**
     * In case the Algorithm found by the `where` argument doesn't exist, create a new Algorithm with this data.
     */
    create: XOR<AlgorithmCreateInput, AlgorithmUncheckedCreateInput>
    /**
     * In case the Algorithm was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlgorithmUpdateInput, AlgorithmUncheckedUpdateInput>
  }

  /**
   * Algorithm delete
   */
  export type AlgorithmDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
    /**
     * Filter which Algorithm to delete.
     */
    where: AlgorithmWhereUniqueInput
  }

  /**
   * Algorithm deleteMany
   */
  export type AlgorithmDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Algorithms to delete
     */
    where?: AlgorithmWhereInput
  }

  /**
   * Algorithm.codes
   */
  export type Algorithm$codesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    where?: AlgorithmCodeWhereInput
    orderBy?: AlgorithmCodeOrderByWithRelationInput | AlgorithmCodeOrderByWithRelationInput[]
    cursor?: AlgorithmCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlgorithmCodeScalarFieldEnum | AlgorithmCodeScalarFieldEnum[]
  }

  /**
   * Algorithm without action
   */
  export type AlgorithmDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Algorithm
     */
    select?: AlgorithmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmInclude<ExtArgs> | null
  }


  /**
   * Model AlgorithmCode
   */

  export type AggregateAlgorithmCode = {
    _count: AlgorithmCodeCountAggregateOutputType | null
    _avg: AlgorithmCodeAvgAggregateOutputType | null
    _sum: AlgorithmCodeSumAggregateOutputType | null
    _min: AlgorithmCodeMinAggregateOutputType | null
    _max: AlgorithmCodeMaxAggregateOutputType | null
  }

  export type AlgorithmCodeAvgAggregateOutputType = {
    id: number | null
    algorithmId: number | null
  }

  export type AlgorithmCodeSumAggregateOutputType = {
    id: number | null
    algorithmId: number | null
  }

  export type AlgorithmCodeMinAggregateOutputType = {
    id: number | null
    language: string | null
    code: string | null
    algorithmId: number | null
  }

  export type AlgorithmCodeMaxAggregateOutputType = {
    id: number | null
    language: string | null
    code: string | null
    algorithmId: number | null
  }

  export type AlgorithmCodeCountAggregateOutputType = {
    id: number
    language: number
    code: number
    algorithmId: number
    _all: number
  }


  export type AlgorithmCodeAvgAggregateInputType = {
    id?: true
    algorithmId?: true
  }

  export type AlgorithmCodeSumAggregateInputType = {
    id?: true
    algorithmId?: true
  }

  export type AlgorithmCodeMinAggregateInputType = {
    id?: true
    language?: true
    code?: true
    algorithmId?: true
  }

  export type AlgorithmCodeMaxAggregateInputType = {
    id?: true
    language?: true
    code?: true
    algorithmId?: true
  }

  export type AlgorithmCodeCountAggregateInputType = {
    id?: true
    language?: true
    code?: true
    algorithmId?: true
    _all?: true
  }

  export type AlgorithmCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlgorithmCode to aggregate.
     */
    where?: AlgorithmCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlgorithmCodes to fetch.
     */
    orderBy?: AlgorithmCodeOrderByWithRelationInput | AlgorithmCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlgorithmCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlgorithmCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlgorithmCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlgorithmCodes
    **/
    _count?: true | AlgorithmCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlgorithmCodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlgorithmCodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlgorithmCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlgorithmCodeMaxAggregateInputType
  }

  export type GetAlgorithmCodeAggregateType<T extends AlgorithmCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateAlgorithmCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlgorithmCode[P]>
      : GetScalarType<T[P], AggregateAlgorithmCode[P]>
  }




  export type AlgorithmCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlgorithmCodeWhereInput
    orderBy?: AlgorithmCodeOrderByWithAggregationInput | AlgorithmCodeOrderByWithAggregationInput[]
    by: AlgorithmCodeScalarFieldEnum[] | AlgorithmCodeScalarFieldEnum
    having?: AlgorithmCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlgorithmCodeCountAggregateInputType | true
    _avg?: AlgorithmCodeAvgAggregateInputType
    _sum?: AlgorithmCodeSumAggregateInputType
    _min?: AlgorithmCodeMinAggregateInputType
    _max?: AlgorithmCodeMaxAggregateInputType
  }

  export type AlgorithmCodeGroupByOutputType = {
    id: number
    language: string
    code: string
    algorithmId: number
    _count: AlgorithmCodeCountAggregateOutputType | null
    _avg: AlgorithmCodeAvgAggregateOutputType | null
    _sum: AlgorithmCodeSumAggregateOutputType | null
    _min: AlgorithmCodeMinAggregateOutputType | null
    _max: AlgorithmCodeMaxAggregateOutputType | null
  }

  type GetAlgorithmCodeGroupByPayload<T extends AlgorithmCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlgorithmCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlgorithmCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlgorithmCodeGroupByOutputType[P]>
            : GetScalarType<T[P], AlgorithmCodeGroupByOutputType[P]>
        }
      >
    >


  export type AlgorithmCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    language?: boolean
    code?: boolean
    algorithmId?: boolean
    algorithm?: boolean | AlgorithmDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["algorithmCode"]>

  export type AlgorithmCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    language?: boolean
    code?: boolean
    algorithmId?: boolean
    algorithm?: boolean | AlgorithmDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["algorithmCode"]>

  export type AlgorithmCodeSelectScalar = {
    id?: boolean
    language?: boolean
    code?: boolean
    algorithmId?: boolean
  }

  export type AlgorithmCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    algorithm?: boolean | AlgorithmDefaultArgs<ExtArgs>
  }
  export type AlgorithmCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    algorithm?: boolean | AlgorithmDefaultArgs<ExtArgs>
  }

  export type $AlgorithmCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlgorithmCode"
    objects: {
      algorithm: Prisma.$AlgorithmPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      language: string
      code: string
      algorithmId: number
    }, ExtArgs["result"]["algorithmCode"]>
    composites: {}
  }

  type AlgorithmCodeGetPayload<S extends boolean | null | undefined | AlgorithmCodeDefaultArgs> = $Result.GetResult<Prisma.$AlgorithmCodePayload, S>

  type AlgorithmCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlgorithmCodeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlgorithmCodeCountAggregateInputType | true
    }

  export interface AlgorithmCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlgorithmCode'], meta: { name: 'AlgorithmCode' } }
    /**
     * Find zero or one AlgorithmCode that matches the filter.
     * @param {AlgorithmCodeFindUniqueArgs} args - Arguments to find a AlgorithmCode
     * @example
     * // Get one AlgorithmCode
     * const algorithmCode = await prisma.algorithmCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlgorithmCodeFindUniqueArgs>(args: SelectSubset<T, AlgorithmCodeFindUniqueArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AlgorithmCode that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlgorithmCodeFindUniqueOrThrowArgs} args - Arguments to find a AlgorithmCode
     * @example
     * // Get one AlgorithmCode
     * const algorithmCode = await prisma.algorithmCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlgorithmCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, AlgorithmCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AlgorithmCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeFindFirstArgs} args - Arguments to find a AlgorithmCode
     * @example
     * // Get one AlgorithmCode
     * const algorithmCode = await prisma.algorithmCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlgorithmCodeFindFirstArgs>(args?: SelectSubset<T, AlgorithmCodeFindFirstArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AlgorithmCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeFindFirstOrThrowArgs} args - Arguments to find a AlgorithmCode
     * @example
     * // Get one AlgorithmCode
     * const algorithmCode = await prisma.algorithmCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlgorithmCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, AlgorithmCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AlgorithmCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlgorithmCodes
     * const algorithmCodes = await prisma.algorithmCode.findMany()
     * 
     * // Get first 10 AlgorithmCodes
     * const algorithmCodes = await prisma.algorithmCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const algorithmCodeWithIdOnly = await prisma.algorithmCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlgorithmCodeFindManyArgs>(args?: SelectSubset<T, AlgorithmCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AlgorithmCode.
     * @param {AlgorithmCodeCreateArgs} args - Arguments to create a AlgorithmCode.
     * @example
     * // Create one AlgorithmCode
     * const AlgorithmCode = await prisma.algorithmCode.create({
     *   data: {
     *     // ... data to create a AlgorithmCode
     *   }
     * })
     * 
     */
    create<T extends AlgorithmCodeCreateArgs>(args: SelectSubset<T, AlgorithmCodeCreateArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AlgorithmCodes.
     * @param {AlgorithmCodeCreateManyArgs} args - Arguments to create many AlgorithmCodes.
     * @example
     * // Create many AlgorithmCodes
     * const algorithmCode = await prisma.algorithmCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlgorithmCodeCreateManyArgs>(args?: SelectSubset<T, AlgorithmCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AlgorithmCodes and returns the data saved in the database.
     * @param {AlgorithmCodeCreateManyAndReturnArgs} args - Arguments to create many AlgorithmCodes.
     * @example
     * // Create many AlgorithmCodes
     * const algorithmCode = await prisma.algorithmCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AlgorithmCodes and only return the `id`
     * const algorithmCodeWithIdOnly = await prisma.algorithmCode.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlgorithmCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, AlgorithmCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AlgorithmCode.
     * @param {AlgorithmCodeDeleteArgs} args - Arguments to delete one AlgorithmCode.
     * @example
     * // Delete one AlgorithmCode
     * const AlgorithmCode = await prisma.algorithmCode.delete({
     *   where: {
     *     // ... filter to delete one AlgorithmCode
     *   }
     * })
     * 
     */
    delete<T extends AlgorithmCodeDeleteArgs>(args: SelectSubset<T, AlgorithmCodeDeleteArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AlgorithmCode.
     * @param {AlgorithmCodeUpdateArgs} args - Arguments to update one AlgorithmCode.
     * @example
     * // Update one AlgorithmCode
     * const algorithmCode = await prisma.algorithmCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlgorithmCodeUpdateArgs>(args: SelectSubset<T, AlgorithmCodeUpdateArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AlgorithmCodes.
     * @param {AlgorithmCodeDeleteManyArgs} args - Arguments to filter AlgorithmCodes to delete.
     * @example
     * // Delete a few AlgorithmCodes
     * const { count } = await prisma.algorithmCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlgorithmCodeDeleteManyArgs>(args?: SelectSubset<T, AlgorithmCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlgorithmCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlgorithmCodes
     * const algorithmCode = await prisma.algorithmCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlgorithmCodeUpdateManyArgs>(args: SelectSubset<T, AlgorithmCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlgorithmCode.
     * @param {AlgorithmCodeUpsertArgs} args - Arguments to update or create a AlgorithmCode.
     * @example
     * // Update or create a AlgorithmCode
     * const algorithmCode = await prisma.algorithmCode.upsert({
     *   create: {
     *     // ... data to create a AlgorithmCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlgorithmCode we want to update
     *   }
     * })
     */
    upsert<T extends AlgorithmCodeUpsertArgs>(args: SelectSubset<T, AlgorithmCodeUpsertArgs<ExtArgs>>): Prisma__AlgorithmCodeClient<$Result.GetResult<Prisma.$AlgorithmCodePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AlgorithmCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeCountArgs} args - Arguments to filter AlgorithmCodes to count.
     * @example
     * // Count the number of AlgorithmCodes
     * const count = await prisma.algorithmCode.count({
     *   where: {
     *     // ... the filter for the AlgorithmCodes we want to count
     *   }
     * })
    **/
    count<T extends AlgorithmCodeCountArgs>(
      args?: Subset<T, AlgorithmCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlgorithmCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlgorithmCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlgorithmCodeAggregateArgs>(args: Subset<T, AlgorithmCodeAggregateArgs>): Prisma.PrismaPromise<GetAlgorithmCodeAggregateType<T>>

    /**
     * Group by AlgorithmCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlgorithmCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlgorithmCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlgorithmCodeGroupByArgs['orderBy'] }
        : { orderBy?: AlgorithmCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlgorithmCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlgorithmCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlgorithmCode model
   */
  readonly fields: AlgorithmCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlgorithmCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlgorithmCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    algorithm<T extends AlgorithmDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlgorithmDefaultArgs<ExtArgs>>): Prisma__AlgorithmClient<$Result.GetResult<Prisma.$AlgorithmPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AlgorithmCode model
   */ 
  interface AlgorithmCodeFieldRefs {
    readonly id: FieldRef<"AlgorithmCode", 'Int'>
    readonly language: FieldRef<"AlgorithmCode", 'String'>
    readonly code: FieldRef<"AlgorithmCode", 'String'>
    readonly algorithmId: FieldRef<"AlgorithmCode", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * AlgorithmCode findUnique
   */
  export type AlgorithmCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * Filter, which AlgorithmCode to fetch.
     */
    where: AlgorithmCodeWhereUniqueInput
  }

  /**
   * AlgorithmCode findUniqueOrThrow
   */
  export type AlgorithmCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * Filter, which AlgorithmCode to fetch.
     */
    where: AlgorithmCodeWhereUniqueInput
  }

  /**
   * AlgorithmCode findFirst
   */
  export type AlgorithmCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * Filter, which AlgorithmCode to fetch.
     */
    where?: AlgorithmCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlgorithmCodes to fetch.
     */
    orderBy?: AlgorithmCodeOrderByWithRelationInput | AlgorithmCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlgorithmCodes.
     */
    cursor?: AlgorithmCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlgorithmCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlgorithmCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlgorithmCodes.
     */
    distinct?: AlgorithmCodeScalarFieldEnum | AlgorithmCodeScalarFieldEnum[]
  }

  /**
   * AlgorithmCode findFirstOrThrow
   */
  export type AlgorithmCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * Filter, which AlgorithmCode to fetch.
     */
    where?: AlgorithmCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlgorithmCodes to fetch.
     */
    orderBy?: AlgorithmCodeOrderByWithRelationInput | AlgorithmCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlgorithmCodes.
     */
    cursor?: AlgorithmCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlgorithmCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlgorithmCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlgorithmCodes.
     */
    distinct?: AlgorithmCodeScalarFieldEnum | AlgorithmCodeScalarFieldEnum[]
  }

  /**
   * AlgorithmCode findMany
   */
  export type AlgorithmCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * Filter, which AlgorithmCodes to fetch.
     */
    where?: AlgorithmCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlgorithmCodes to fetch.
     */
    orderBy?: AlgorithmCodeOrderByWithRelationInput | AlgorithmCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlgorithmCodes.
     */
    cursor?: AlgorithmCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlgorithmCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlgorithmCodes.
     */
    skip?: number
    distinct?: AlgorithmCodeScalarFieldEnum | AlgorithmCodeScalarFieldEnum[]
  }

  /**
   * AlgorithmCode create
   */
  export type AlgorithmCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a AlgorithmCode.
     */
    data: XOR<AlgorithmCodeCreateInput, AlgorithmCodeUncheckedCreateInput>
  }

  /**
   * AlgorithmCode createMany
   */
  export type AlgorithmCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlgorithmCodes.
     */
    data: AlgorithmCodeCreateManyInput | AlgorithmCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlgorithmCode createManyAndReturn
   */
  export type AlgorithmCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AlgorithmCodes.
     */
    data: AlgorithmCodeCreateManyInput | AlgorithmCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AlgorithmCode update
   */
  export type AlgorithmCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a AlgorithmCode.
     */
    data: XOR<AlgorithmCodeUpdateInput, AlgorithmCodeUncheckedUpdateInput>
    /**
     * Choose, which AlgorithmCode to update.
     */
    where: AlgorithmCodeWhereUniqueInput
  }

  /**
   * AlgorithmCode updateMany
   */
  export type AlgorithmCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlgorithmCodes.
     */
    data: XOR<AlgorithmCodeUpdateManyMutationInput, AlgorithmCodeUncheckedUpdateManyInput>
    /**
     * Filter which AlgorithmCodes to update
     */
    where?: AlgorithmCodeWhereInput
  }

  /**
   * AlgorithmCode upsert
   */
  export type AlgorithmCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the AlgorithmCode to update in case it exists.
     */
    where: AlgorithmCodeWhereUniqueInput
    /**
     * In case the AlgorithmCode found by the `where` argument doesn't exist, create a new AlgorithmCode with this data.
     */
    create: XOR<AlgorithmCodeCreateInput, AlgorithmCodeUncheckedCreateInput>
    /**
     * In case the AlgorithmCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlgorithmCodeUpdateInput, AlgorithmCodeUncheckedUpdateInput>
  }

  /**
   * AlgorithmCode delete
   */
  export type AlgorithmCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
    /**
     * Filter which AlgorithmCode to delete.
     */
    where: AlgorithmCodeWhereUniqueInput
  }

  /**
   * AlgorithmCode deleteMany
   */
  export type AlgorithmCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlgorithmCodes to delete
     */
    where?: AlgorithmCodeWhereInput
  }

  /**
   * AlgorithmCode without action
   */
  export type AlgorithmCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlgorithmCode
     */
    select?: AlgorithmCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlgorithmCodeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AlgorithmScalarFieldEnum: {
    id: 'id',
    key: 'key',
    name: 'name',
    description: 'description',
    steps: 'steps',
    keyConcepts: 'keyConcepts',
    worstCase: 'worstCase',
    bestCase: 'bestCase',
    averageCase: 'averageCase',
    spaceComplexity: 'spaceComplexity',
    advantages: 'advantages',
    disadvantages: 'disadvantages',
    practicalUse: 'practicalUse',
    metadataName: 'metadataName',
    metadataDescription: 'metadataDescription',
    metadataImage: 'metadataImage',
    metadataRoute: 'metadataRoute'
  };

  export type AlgorithmScalarFieldEnum = (typeof AlgorithmScalarFieldEnum)[keyof typeof AlgorithmScalarFieldEnum]


  export const AlgorithmCodeScalarFieldEnum: {
    id: 'id',
    language: 'language',
    code: 'code',
    algorithmId: 'algorithmId'
  };

  export type AlgorithmCodeScalarFieldEnum = (typeof AlgorithmCodeScalarFieldEnum)[keyof typeof AlgorithmCodeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AlgorithmWhereInput = {
    AND?: AlgorithmWhereInput | AlgorithmWhereInput[]
    OR?: AlgorithmWhereInput[]
    NOT?: AlgorithmWhereInput | AlgorithmWhereInput[]
    id?: IntFilter<"Algorithm"> | number
    key?: StringFilter<"Algorithm"> | string
    name?: StringFilter<"Algorithm"> | string
    description?: StringFilter<"Algorithm"> | string
    steps?: StringNullableListFilter<"Algorithm">
    keyConcepts?: StringNullableListFilter<"Algorithm">
    worstCase?: StringFilter<"Algorithm"> | string
    bestCase?: StringFilter<"Algorithm"> | string
    averageCase?: StringFilter<"Algorithm"> | string
    spaceComplexity?: StringFilter<"Algorithm"> | string
    advantages?: StringNullableListFilter<"Algorithm">
    disadvantages?: StringNullableListFilter<"Algorithm">
    practicalUse?: StringNullableListFilter<"Algorithm">
    metadataName?: StringFilter<"Algorithm"> | string
    metadataDescription?: StringFilter<"Algorithm"> | string
    metadataImage?: StringFilter<"Algorithm"> | string
    metadataRoute?: StringFilter<"Algorithm"> | string
    codes?: AlgorithmCodeListRelationFilter
  }

  export type AlgorithmOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    steps?: SortOrder
    keyConcepts?: SortOrder
    worstCase?: SortOrder
    bestCase?: SortOrder
    averageCase?: SortOrder
    spaceComplexity?: SortOrder
    advantages?: SortOrder
    disadvantages?: SortOrder
    practicalUse?: SortOrder
    metadataName?: SortOrder
    metadataDescription?: SortOrder
    metadataImage?: SortOrder
    metadataRoute?: SortOrder
    codes?: AlgorithmCodeOrderByRelationAggregateInput
  }

  export type AlgorithmWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    key?: string
    AND?: AlgorithmWhereInput | AlgorithmWhereInput[]
    OR?: AlgorithmWhereInput[]
    NOT?: AlgorithmWhereInput | AlgorithmWhereInput[]
    name?: StringFilter<"Algorithm"> | string
    description?: StringFilter<"Algorithm"> | string
    steps?: StringNullableListFilter<"Algorithm">
    keyConcepts?: StringNullableListFilter<"Algorithm">
    worstCase?: StringFilter<"Algorithm"> | string
    bestCase?: StringFilter<"Algorithm"> | string
    averageCase?: StringFilter<"Algorithm"> | string
    spaceComplexity?: StringFilter<"Algorithm"> | string
    advantages?: StringNullableListFilter<"Algorithm">
    disadvantages?: StringNullableListFilter<"Algorithm">
    practicalUse?: StringNullableListFilter<"Algorithm">
    metadataName?: StringFilter<"Algorithm"> | string
    metadataDescription?: StringFilter<"Algorithm"> | string
    metadataImage?: StringFilter<"Algorithm"> | string
    metadataRoute?: StringFilter<"Algorithm"> | string
    codes?: AlgorithmCodeListRelationFilter
  }, "id" | "key">

  export type AlgorithmOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    steps?: SortOrder
    keyConcepts?: SortOrder
    worstCase?: SortOrder
    bestCase?: SortOrder
    averageCase?: SortOrder
    spaceComplexity?: SortOrder
    advantages?: SortOrder
    disadvantages?: SortOrder
    practicalUse?: SortOrder
    metadataName?: SortOrder
    metadataDescription?: SortOrder
    metadataImage?: SortOrder
    metadataRoute?: SortOrder
    _count?: AlgorithmCountOrderByAggregateInput
    _avg?: AlgorithmAvgOrderByAggregateInput
    _max?: AlgorithmMaxOrderByAggregateInput
    _min?: AlgorithmMinOrderByAggregateInput
    _sum?: AlgorithmSumOrderByAggregateInput
  }

  export type AlgorithmScalarWhereWithAggregatesInput = {
    AND?: AlgorithmScalarWhereWithAggregatesInput | AlgorithmScalarWhereWithAggregatesInput[]
    OR?: AlgorithmScalarWhereWithAggregatesInput[]
    NOT?: AlgorithmScalarWhereWithAggregatesInput | AlgorithmScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Algorithm"> | number
    key?: StringWithAggregatesFilter<"Algorithm"> | string
    name?: StringWithAggregatesFilter<"Algorithm"> | string
    description?: StringWithAggregatesFilter<"Algorithm"> | string
    steps?: StringNullableListFilter<"Algorithm">
    keyConcepts?: StringNullableListFilter<"Algorithm">
    worstCase?: StringWithAggregatesFilter<"Algorithm"> | string
    bestCase?: StringWithAggregatesFilter<"Algorithm"> | string
    averageCase?: StringWithAggregatesFilter<"Algorithm"> | string
    spaceComplexity?: StringWithAggregatesFilter<"Algorithm"> | string
    advantages?: StringNullableListFilter<"Algorithm">
    disadvantages?: StringNullableListFilter<"Algorithm">
    practicalUse?: StringNullableListFilter<"Algorithm">
    metadataName?: StringWithAggregatesFilter<"Algorithm"> | string
    metadataDescription?: StringWithAggregatesFilter<"Algorithm"> | string
    metadataImage?: StringWithAggregatesFilter<"Algorithm"> | string
    metadataRoute?: StringWithAggregatesFilter<"Algorithm"> | string
  }

  export type AlgorithmCodeWhereInput = {
    AND?: AlgorithmCodeWhereInput | AlgorithmCodeWhereInput[]
    OR?: AlgorithmCodeWhereInput[]
    NOT?: AlgorithmCodeWhereInput | AlgorithmCodeWhereInput[]
    id?: IntFilter<"AlgorithmCode"> | number
    language?: StringFilter<"AlgorithmCode"> | string
    code?: StringFilter<"AlgorithmCode"> | string
    algorithmId?: IntFilter<"AlgorithmCode"> | number
    algorithm?: XOR<AlgorithmRelationFilter, AlgorithmWhereInput>
  }

  export type AlgorithmCodeOrderByWithRelationInput = {
    id?: SortOrder
    language?: SortOrder
    code?: SortOrder
    algorithmId?: SortOrder
    algorithm?: AlgorithmOrderByWithRelationInput
  }

  export type AlgorithmCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AlgorithmCodeWhereInput | AlgorithmCodeWhereInput[]
    OR?: AlgorithmCodeWhereInput[]
    NOT?: AlgorithmCodeWhereInput | AlgorithmCodeWhereInput[]
    language?: StringFilter<"AlgorithmCode"> | string
    code?: StringFilter<"AlgorithmCode"> | string
    algorithmId?: IntFilter<"AlgorithmCode"> | number
    algorithm?: XOR<AlgorithmRelationFilter, AlgorithmWhereInput>
  }, "id">

  export type AlgorithmCodeOrderByWithAggregationInput = {
    id?: SortOrder
    language?: SortOrder
    code?: SortOrder
    algorithmId?: SortOrder
    _count?: AlgorithmCodeCountOrderByAggregateInput
    _avg?: AlgorithmCodeAvgOrderByAggregateInput
    _max?: AlgorithmCodeMaxOrderByAggregateInput
    _min?: AlgorithmCodeMinOrderByAggregateInput
    _sum?: AlgorithmCodeSumOrderByAggregateInput
  }

  export type AlgorithmCodeScalarWhereWithAggregatesInput = {
    AND?: AlgorithmCodeScalarWhereWithAggregatesInput | AlgorithmCodeScalarWhereWithAggregatesInput[]
    OR?: AlgorithmCodeScalarWhereWithAggregatesInput[]
    NOT?: AlgorithmCodeScalarWhereWithAggregatesInput | AlgorithmCodeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AlgorithmCode"> | number
    language?: StringWithAggregatesFilter<"AlgorithmCode"> | string
    code?: StringWithAggregatesFilter<"AlgorithmCode"> | string
    algorithmId?: IntWithAggregatesFilter<"AlgorithmCode"> | number
  }

  export type AlgorithmCreateInput = {
    key: string
    name: string
    description: string
    steps?: AlgorithmCreatestepsInput | string[]
    keyConcepts?: AlgorithmCreatekeyConceptsInput | string[]
    worstCase: string
    bestCase: string
    averageCase: string
    spaceComplexity: string
    advantages?: AlgorithmCreateadvantagesInput | string[]
    disadvantages?: AlgorithmCreatedisadvantagesInput | string[]
    practicalUse?: AlgorithmCreatepracticalUseInput | string[]
    metadataName: string
    metadataDescription: string
    metadataImage: string
    metadataRoute: string
    codes?: AlgorithmCodeCreateNestedManyWithoutAlgorithmInput
  }

  export type AlgorithmUncheckedCreateInput = {
    id?: number
    key: string
    name: string
    description: string
    steps?: AlgorithmCreatestepsInput | string[]
    keyConcepts?: AlgorithmCreatekeyConceptsInput | string[]
    worstCase: string
    bestCase: string
    averageCase: string
    spaceComplexity: string
    advantages?: AlgorithmCreateadvantagesInput | string[]
    disadvantages?: AlgorithmCreatedisadvantagesInput | string[]
    practicalUse?: AlgorithmCreatepracticalUseInput | string[]
    metadataName: string
    metadataDescription: string
    metadataImage: string
    metadataRoute: string
    codes?: AlgorithmCodeUncheckedCreateNestedManyWithoutAlgorithmInput
  }

  export type AlgorithmUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    steps?: AlgorithmUpdatestepsInput | string[]
    keyConcepts?: AlgorithmUpdatekeyConceptsInput | string[]
    worstCase?: StringFieldUpdateOperationsInput | string
    bestCase?: StringFieldUpdateOperationsInput | string
    averageCase?: StringFieldUpdateOperationsInput | string
    spaceComplexity?: StringFieldUpdateOperationsInput | string
    advantages?: AlgorithmUpdateadvantagesInput | string[]
    disadvantages?: AlgorithmUpdatedisadvantagesInput | string[]
    practicalUse?: AlgorithmUpdatepracticalUseInput | string[]
    metadataName?: StringFieldUpdateOperationsInput | string
    metadataDescription?: StringFieldUpdateOperationsInput | string
    metadataImage?: StringFieldUpdateOperationsInput | string
    metadataRoute?: StringFieldUpdateOperationsInput | string
    codes?: AlgorithmCodeUpdateManyWithoutAlgorithmNestedInput
  }

  export type AlgorithmUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    steps?: AlgorithmUpdatestepsInput | string[]
    keyConcepts?: AlgorithmUpdatekeyConceptsInput | string[]
    worstCase?: StringFieldUpdateOperationsInput | string
    bestCase?: StringFieldUpdateOperationsInput | string
    averageCase?: StringFieldUpdateOperationsInput | string
    spaceComplexity?: StringFieldUpdateOperationsInput | string
    advantages?: AlgorithmUpdateadvantagesInput | string[]
    disadvantages?: AlgorithmUpdatedisadvantagesInput | string[]
    practicalUse?: AlgorithmUpdatepracticalUseInput | string[]
    metadataName?: StringFieldUpdateOperationsInput | string
    metadataDescription?: StringFieldUpdateOperationsInput | string
    metadataImage?: StringFieldUpdateOperationsInput | string
    metadataRoute?: StringFieldUpdateOperationsInput | string
    codes?: AlgorithmCodeUncheckedUpdateManyWithoutAlgorithmNestedInput
  }

  export type AlgorithmCreateManyInput = {
    id?: number
    key: string
    name: string
    description: string
    steps?: AlgorithmCreatestepsInput | string[]
    keyConcepts?: AlgorithmCreatekeyConceptsInput | string[]
    worstCase: string
    bestCase: string
    averageCase: string
    spaceComplexity: string
    advantages?: AlgorithmCreateadvantagesInput | string[]
    disadvantages?: AlgorithmCreatedisadvantagesInput | string[]
    practicalUse?: AlgorithmCreatepracticalUseInput | string[]
    metadataName: string
    metadataDescription: string
    metadataImage: string
    metadataRoute: string
  }

  export type AlgorithmUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    steps?: AlgorithmUpdatestepsInput | string[]
    keyConcepts?: AlgorithmUpdatekeyConceptsInput | string[]
    worstCase?: StringFieldUpdateOperationsInput | string
    bestCase?: StringFieldUpdateOperationsInput | string
    averageCase?: StringFieldUpdateOperationsInput | string
    spaceComplexity?: StringFieldUpdateOperationsInput | string
    advantages?: AlgorithmUpdateadvantagesInput | string[]
    disadvantages?: AlgorithmUpdatedisadvantagesInput | string[]
    practicalUse?: AlgorithmUpdatepracticalUseInput | string[]
    metadataName?: StringFieldUpdateOperationsInput | string
    metadataDescription?: StringFieldUpdateOperationsInput | string
    metadataImage?: StringFieldUpdateOperationsInput | string
    metadataRoute?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    steps?: AlgorithmUpdatestepsInput | string[]
    keyConcepts?: AlgorithmUpdatekeyConceptsInput | string[]
    worstCase?: StringFieldUpdateOperationsInput | string
    bestCase?: StringFieldUpdateOperationsInput | string
    averageCase?: StringFieldUpdateOperationsInput | string
    spaceComplexity?: StringFieldUpdateOperationsInput | string
    advantages?: AlgorithmUpdateadvantagesInput | string[]
    disadvantages?: AlgorithmUpdatedisadvantagesInput | string[]
    practicalUse?: AlgorithmUpdatepracticalUseInput | string[]
    metadataName?: StringFieldUpdateOperationsInput | string
    metadataDescription?: StringFieldUpdateOperationsInput | string
    metadataImage?: StringFieldUpdateOperationsInput | string
    metadataRoute?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmCodeCreateInput = {
    language: string
    code: string
    algorithm: AlgorithmCreateNestedOneWithoutCodesInput
  }

  export type AlgorithmCodeUncheckedCreateInput = {
    id?: number
    language: string
    code: string
    algorithmId: number
  }

  export type AlgorithmCodeUpdateInput = {
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    algorithm?: AlgorithmUpdateOneRequiredWithoutCodesNestedInput
  }

  export type AlgorithmCodeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    algorithmId?: IntFieldUpdateOperationsInput | number
  }

  export type AlgorithmCodeCreateManyInput = {
    id?: number
    language: string
    code: string
    algorithmId: number
  }

  export type AlgorithmCodeUpdateManyMutationInput = {
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmCodeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    algorithmId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type AlgorithmCodeListRelationFilter = {
    every?: AlgorithmCodeWhereInput
    some?: AlgorithmCodeWhereInput
    none?: AlgorithmCodeWhereInput
  }

  export type AlgorithmCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlgorithmCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    steps?: SortOrder
    keyConcepts?: SortOrder
    worstCase?: SortOrder
    bestCase?: SortOrder
    averageCase?: SortOrder
    spaceComplexity?: SortOrder
    advantages?: SortOrder
    disadvantages?: SortOrder
    practicalUse?: SortOrder
    metadataName?: SortOrder
    metadataDescription?: SortOrder
    metadataImage?: SortOrder
    metadataRoute?: SortOrder
  }

  export type AlgorithmAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AlgorithmMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    worstCase?: SortOrder
    bestCase?: SortOrder
    averageCase?: SortOrder
    spaceComplexity?: SortOrder
    metadataName?: SortOrder
    metadataDescription?: SortOrder
    metadataImage?: SortOrder
    metadataRoute?: SortOrder
  }

  export type AlgorithmMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    name?: SortOrder
    description?: SortOrder
    worstCase?: SortOrder
    bestCase?: SortOrder
    averageCase?: SortOrder
    spaceComplexity?: SortOrder
    metadataName?: SortOrder
    metadataDescription?: SortOrder
    metadataImage?: SortOrder
    metadataRoute?: SortOrder
  }

  export type AlgorithmSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type AlgorithmRelationFilter = {
    is?: AlgorithmWhereInput
    isNot?: AlgorithmWhereInput
  }

  export type AlgorithmCodeCountOrderByAggregateInput = {
    id?: SortOrder
    language?: SortOrder
    code?: SortOrder
    algorithmId?: SortOrder
  }

  export type AlgorithmCodeAvgOrderByAggregateInput = {
    id?: SortOrder
    algorithmId?: SortOrder
  }

  export type AlgorithmCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    language?: SortOrder
    code?: SortOrder
    algorithmId?: SortOrder
  }

  export type AlgorithmCodeMinOrderByAggregateInput = {
    id?: SortOrder
    language?: SortOrder
    code?: SortOrder
    algorithmId?: SortOrder
  }

  export type AlgorithmCodeSumOrderByAggregateInput = {
    id?: SortOrder
    algorithmId?: SortOrder
  }

  export type AlgorithmCreatestepsInput = {
    set: string[]
  }

  export type AlgorithmCreatekeyConceptsInput = {
    set: string[]
  }

  export type AlgorithmCreateadvantagesInput = {
    set: string[]
  }

  export type AlgorithmCreatedisadvantagesInput = {
    set: string[]
  }

  export type AlgorithmCreatepracticalUseInput = {
    set: string[]
  }

  export type AlgorithmCodeCreateNestedManyWithoutAlgorithmInput = {
    create?: XOR<AlgorithmCodeCreateWithoutAlgorithmInput, AlgorithmCodeUncheckedCreateWithoutAlgorithmInput> | AlgorithmCodeCreateWithoutAlgorithmInput[] | AlgorithmCodeUncheckedCreateWithoutAlgorithmInput[]
    connectOrCreate?: AlgorithmCodeCreateOrConnectWithoutAlgorithmInput | AlgorithmCodeCreateOrConnectWithoutAlgorithmInput[]
    createMany?: AlgorithmCodeCreateManyAlgorithmInputEnvelope
    connect?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
  }

  export type AlgorithmCodeUncheckedCreateNestedManyWithoutAlgorithmInput = {
    create?: XOR<AlgorithmCodeCreateWithoutAlgorithmInput, AlgorithmCodeUncheckedCreateWithoutAlgorithmInput> | AlgorithmCodeCreateWithoutAlgorithmInput[] | AlgorithmCodeUncheckedCreateWithoutAlgorithmInput[]
    connectOrCreate?: AlgorithmCodeCreateOrConnectWithoutAlgorithmInput | AlgorithmCodeCreateOrConnectWithoutAlgorithmInput[]
    createMany?: AlgorithmCodeCreateManyAlgorithmInputEnvelope
    connect?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type AlgorithmUpdatestepsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AlgorithmUpdatekeyConceptsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AlgorithmUpdateadvantagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AlgorithmUpdatedisadvantagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AlgorithmUpdatepracticalUseInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AlgorithmCodeUpdateManyWithoutAlgorithmNestedInput = {
    create?: XOR<AlgorithmCodeCreateWithoutAlgorithmInput, AlgorithmCodeUncheckedCreateWithoutAlgorithmInput> | AlgorithmCodeCreateWithoutAlgorithmInput[] | AlgorithmCodeUncheckedCreateWithoutAlgorithmInput[]
    connectOrCreate?: AlgorithmCodeCreateOrConnectWithoutAlgorithmInput | AlgorithmCodeCreateOrConnectWithoutAlgorithmInput[]
    upsert?: AlgorithmCodeUpsertWithWhereUniqueWithoutAlgorithmInput | AlgorithmCodeUpsertWithWhereUniqueWithoutAlgorithmInput[]
    createMany?: AlgorithmCodeCreateManyAlgorithmInputEnvelope
    set?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    disconnect?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    delete?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    connect?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    update?: AlgorithmCodeUpdateWithWhereUniqueWithoutAlgorithmInput | AlgorithmCodeUpdateWithWhereUniqueWithoutAlgorithmInput[]
    updateMany?: AlgorithmCodeUpdateManyWithWhereWithoutAlgorithmInput | AlgorithmCodeUpdateManyWithWhereWithoutAlgorithmInput[]
    deleteMany?: AlgorithmCodeScalarWhereInput | AlgorithmCodeScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AlgorithmCodeUncheckedUpdateManyWithoutAlgorithmNestedInput = {
    create?: XOR<AlgorithmCodeCreateWithoutAlgorithmInput, AlgorithmCodeUncheckedCreateWithoutAlgorithmInput> | AlgorithmCodeCreateWithoutAlgorithmInput[] | AlgorithmCodeUncheckedCreateWithoutAlgorithmInput[]
    connectOrCreate?: AlgorithmCodeCreateOrConnectWithoutAlgorithmInput | AlgorithmCodeCreateOrConnectWithoutAlgorithmInput[]
    upsert?: AlgorithmCodeUpsertWithWhereUniqueWithoutAlgorithmInput | AlgorithmCodeUpsertWithWhereUniqueWithoutAlgorithmInput[]
    createMany?: AlgorithmCodeCreateManyAlgorithmInputEnvelope
    set?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    disconnect?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    delete?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    connect?: AlgorithmCodeWhereUniqueInput | AlgorithmCodeWhereUniqueInput[]
    update?: AlgorithmCodeUpdateWithWhereUniqueWithoutAlgorithmInput | AlgorithmCodeUpdateWithWhereUniqueWithoutAlgorithmInput[]
    updateMany?: AlgorithmCodeUpdateManyWithWhereWithoutAlgorithmInput | AlgorithmCodeUpdateManyWithWhereWithoutAlgorithmInput[]
    deleteMany?: AlgorithmCodeScalarWhereInput | AlgorithmCodeScalarWhereInput[]
  }

  export type AlgorithmCreateNestedOneWithoutCodesInput = {
    create?: XOR<AlgorithmCreateWithoutCodesInput, AlgorithmUncheckedCreateWithoutCodesInput>
    connectOrCreate?: AlgorithmCreateOrConnectWithoutCodesInput
    connect?: AlgorithmWhereUniqueInput
  }

  export type AlgorithmUpdateOneRequiredWithoutCodesNestedInput = {
    create?: XOR<AlgorithmCreateWithoutCodesInput, AlgorithmUncheckedCreateWithoutCodesInput>
    connectOrCreate?: AlgorithmCreateOrConnectWithoutCodesInput
    upsert?: AlgorithmUpsertWithoutCodesInput
    connect?: AlgorithmWhereUniqueInput
    update?: XOR<XOR<AlgorithmUpdateToOneWithWhereWithoutCodesInput, AlgorithmUpdateWithoutCodesInput>, AlgorithmUncheckedUpdateWithoutCodesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type AlgorithmCodeCreateWithoutAlgorithmInput = {
    language: string
    code: string
  }

  export type AlgorithmCodeUncheckedCreateWithoutAlgorithmInput = {
    id?: number
    language: string
    code: string
  }

  export type AlgorithmCodeCreateOrConnectWithoutAlgorithmInput = {
    where: AlgorithmCodeWhereUniqueInput
    create: XOR<AlgorithmCodeCreateWithoutAlgorithmInput, AlgorithmCodeUncheckedCreateWithoutAlgorithmInput>
  }

  export type AlgorithmCodeCreateManyAlgorithmInputEnvelope = {
    data: AlgorithmCodeCreateManyAlgorithmInput | AlgorithmCodeCreateManyAlgorithmInput[]
    skipDuplicates?: boolean
  }

  export type AlgorithmCodeUpsertWithWhereUniqueWithoutAlgorithmInput = {
    where: AlgorithmCodeWhereUniqueInput
    update: XOR<AlgorithmCodeUpdateWithoutAlgorithmInput, AlgorithmCodeUncheckedUpdateWithoutAlgorithmInput>
    create: XOR<AlgorithmCodeCreateWithoutAlgorithmInput, AlgorithmCodeUncheckedCreateWithoutAlgorithmInput>
  }

  export type AlgorithmCodeUpdateWithWhereUniqueWithoutAlgorithmInput = {
    where: AlgorithmCodeWhereUniqueInput
    data: XOR<AlgorithmCodeUpdateWithoutAlgorithmInput, AlgorithmCodeUncheckedUpdateWithoutAlgorithmInput>
  }

  export type AlgorithmCodeUpdateManyWithWhereWithoutAlgorithmInput = {
    where: AlgorithmCodeScalarWhereInput
    data: XOR<AlgorithmCodeUpdateManyMutationInput, AlgorithmCodeUncheckedUpdateManyWithoutAlgorithmInput>
  }

  export type AlgorithmCodeScalarWhereInput = {
    AND?: AlgorithmCodeScalarWhereInput | AlgorithmCodeScalarWhereInput[]
    OR?: AlgorithmCodeScalarWhereInput[]
    NOT?: AlgorithmCodeScalarWhereInput | AlgorithmCodeScalarWhereInput[]
    id?: IntFilter<"AlgorithmCode"> | number
    language?: StringFilter<"AlgorithmCode"> | string
    code?: StringFilter<"AlgorithmCode"> | string
    algorithmId?: IntFilter<"AlgorithmCode"> | number
  }

  export type AlgorithmCreateWithoutCodesInput = {
    key: string
    name: string
    description: string
    steps?: AlgorithmCreatestepsInput | string[]
    keyConcepts?: AlgorithmCreatekeyConceptsInput | string[]
    worstCase: string
    bestCase: string
    averageCase: string
    spaceComplexity: string
    advantages?: AlgorithmCreateadvantagesInput | string[]
    disadvantages?: AlgorithmCreatedisadvantagesInput | string[]
    practicalUse?: AlgorithmCreatepracticalUseInput | string[]
    metadataName: string
    metadataDescription: string
    metadataImage: string
    metadataRoute: string
  }

  export type AlgorithmUncheckedCreateWithoutCodesInput = {
    id?: number
    key: string
    name: string
    description: string
    steps?: AlgorithmCreatestepsInput | string[]
    keyConcepts?: AlgorithmCreatekeyConceptsInput | string[]
    worstCase: string
    bestCase: string
    averageCase: string
    spaceComplexity: string
    advantages?: AlgorithmCreateadvantagesInput | string[]
    disadvantages?: AlgorithmCreatedisadvantagesInput | string[]
    practicalUse?: AlgorithmCreatepracticalUseInput | string[]
    metadataName: string
    metadataDescription: string
    metadataImage: string
    metadataRoute: string
  }

  export type AlgorithmCreateOrConnectWithoutCodesInput = {
    where: AlgorithmWhereUniqueInput
    create: XOR<AlgorithmCreateWithoutCodesInput, AlgorithmUncheckedCreateWithoutCodesInput>
  }

  export type AlgorithmUpsertWithoutCodesInput = {
    update: XOR<AlgorithmUpdateWithoutCodesInput, AlgorithmUncheckedUpdateWithoutCodesInput>
    create: XOR<AlgorithmCreateWithoutCodesInput, AlgorithmUncheckedCreateWithoutCodesInput>
    where?: AlgorithmWhereInput
  }

  export type AlgorithmUpdateToOneWithWhereWithoutCodesInput = {
    where?: AlgorithmWhereInput
    data: XOR<AlgorithmUpdateWithoutCodesInput, AlgorithmUncheckedUpdateWithoutCodesInput>
  }

  export type AlgorithmUpdateWithoutCodesInput = {
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    steps?: AlgorithmUpdatestepsInput | string[]
    keyConcepts?: AlgorithmUpdatekeyConceptsInput | string[]
    worstCase?: StringFieldUpdateOperationsInput | string
    bestCase?: StringFieldUpdateOperationsInput | string
    averageCase?: StringFieldUpdateOperationsInput | string
    spaceComplexity?: StringFieldUpdateOperationsInput | string
    advantages?: AlgorithmUpdateadvantagesInput | string[]
    disadvantages?: AlgorithmUpdatedisadvantagesInput | string[]
    practicalUse?: AlgorithmUpdatepracticalUseInput | string[]
    metadataName?: StringFieldUpdateOperationsInput | string
    metadataDescription?: StringFieldUpdateOperationsInput | string
    metadataImage?: StringFieldUpdateOperationsInput | string
    metadataRoute?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmUncheckedUpdateWithoutCodesInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    steps?: AlgorithmUpdatestepsInput | string[]
    keyConcepts?: AlgorithmUpdatekeyConceptsInput | string[]
    worstCase?: StringFieldUpdateOperationsInput | string
    bestCase?: StringFieldUpdateOperationsInput | string
    averageCase?: StringFieldUpdateOperationsInput | string
    spaceComplexity?: StringFieldUpdateOperationsInput | string
    advantages?: AlgorithmUpdateadvantagesInput | string[]
    disadvantages?: AlgorithmUpdatedisadvantagesInput | string[]
    practicalUse?: AlgorithmUpdatepracticalUseInput | string[]
    metadataName?: StringFieldUpdateOperationsInput | string
    metadataDescription?: StringFieldUpdateOperationsInput | string
    metadataImage?: StringFieldUpdateOperationsInput | string
    metadataRoute?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmCodeCreateManyAlgorithmInput = {
    id?: number
    language: string
    code: string
  }

  export type AlgorithmCodeUpdateWithoutAlgorithmInput = {
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmCodeUncheckedUpdateWithoutAlgorithmInput = {
    id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
  }

  export type AlgorithmCodeUncheckedUpdateManyWithoutAlgorithmInput = {
    id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AlgorithmCountOutputTypeDefaultArgs instead
     */
    export type AlgorithmCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlgorithmCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlgorithmDefaultArgs instead
     */
    export type AlgorithmArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlgorithmDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlgorithmCodeDefaultArgs instead
     */
    export type AlgorithmCodeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlgorithmCodeDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}