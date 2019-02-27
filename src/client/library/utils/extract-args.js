/* @flow */
import assert from 'assert';

export function extractPort(): number {
  const possiblePortArg: string = process.argv[process.argv.length - 1] || '';
  let [,port: ?string] = possiblePortArg.match(/^PORT:(\d+)$/) || [];
  assert(!!port, 'client startup error, invalid argv port argument recieved');
  let portNum: number = Number(port);
  assert(portNum >= 0x400 && portNum <= 0xFFFF, 'client startup error, '+
    'incorrectly formatted port argument recieved');
  return portNum;
}

export function extractHost(): string {
  const possibleHostArg: string = process.argv[process.argv.length - 2] || '';
  let [,host: ?string] = possibleHostArg.match(/^NONCE:(.*)$/) || [];
  assert(!!host, 'client startup error, invalid argv host argument recieved');
  return host;
}

export function extractNonce(): string {
  const possibleNonceArg: string = process.argv[process.argv.length - 3] || '';
  let [,nonce: ?string] = possibleNonceArg.match(/^NONCE:(.*)$/) || []; 
  assert(!!nonce, 'client startup error, invalid argv nonce argument recieved');
  return nonce;
} 