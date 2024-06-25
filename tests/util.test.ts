/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, test, vi } from "vitest";
import { Client, ClientUser, Guild, Message, VoiceState } from "discord.js";
import { rawBotVoiceState, rawClientUser, rawGuild, rawMessage, rawUserVoiceState } from "./raw";
import {
  DisTubeError,
  DisTubeVoice as _Voice,
  checkIntents,
  checkInvalidKey,
  formatDuration,
  isClientInstance,
  isMemberInstance,
  isMessageInstance,
  isNsfwChannel,
  isSupportedVoiceChannel,
  isTextChannelInstance,
  isURL,
  isVoiceChannelEmpty,
  resolveGuildId,
} from "@";
import type { Mocked } from "vitest";

vi.mock("@/core/DisTubeVoice");

const Voice: Mocked<typeof _Voice> = _Voice;

const client = new Client({ intents: [] });
// @ts-expect-error
client.user = new ClientUser(client, rawClientUser);
// @ts-expect-error
const guild = new Guild(client, rawGuild);
const textChannel = guild.channels.cache.get("737499503384461325");
const voiceChannel = guild.channels.cache.get("853225781604646933");
const stageChannel = guild.channels.cache.get("835876864458489857");
const threadChannel = guild.channels.cache.get("1098543313134563338");
const forumChannel = guild.channels.cache.get("737499503384461324");
Object.defineProperty(voiceChannel, "joinable", { value: true, writable: false });
Object.defineProperty(stageChannel, "joinable", { value: false, writable: false });
// @ts-expect-error
const botVoiceState = new VoiceState(guild, rawBotVoiceState);
// @ts-expect-error
const userVoiceState = new VoiceState(guild, rawUserVoiceState);
// @ts-expect-error
const message = new Message(client, rawMessage);
const clientMember = guild.members.resolve(guild.client.user.id);

test("isSupportedVoiceChannel()", () => {
  const testFn = isSupportedVoiceChannel;
  expect(testFn(voiceChannel)).toBe(true);
  expect(testFn(stageChannel)).toBe(true);
  expect(testFn(textChannel)).toBe(false);
  expect(testFn(threadChannel)).toBe(false);
  expect(testFn(forumChannel)).toBe(false);
  expect(testFn(message)).toBe(false);
  expect(testFn(guild)).toBe(false);
  expect(testFn(client)).toBe(false);
  expect(testFn(client.user)).toBe(false);
  expect(testFn(clientMember)).toBe(false);
  expect(testFn(botVoiceState)).toBe(false);
  expect(testFn(userVoiceState)).toBe(false);
});

test("isMessageInstance()", () => {
  const testFn = isMessageInstance;
  expect(testFn(voiceChannel)).toBe(false);
  expect(testFn(stageChannel)).toBe(false);
  expect(testFn(textChannel)).toBe(false);
  expect(testFn(threadChannel)).toBe(false);
  expect(testFn(forumChannel)).toBe(false);
  expect(testFn(message)).toBe(true);
  expect(testFn(guild)).toBe(false);
  expect(testFn(client)).toBe(false);
  expect(testFn(client.user)).toBe(false);
  expect(testFn(clientMember)).toBe(false);
  expect(testFn(botVoiceState)).toBe(false);
  expect(testFn(userVoiceState)).toBe(false);
});

test("isTextChannelInstance()", () => {
  const testFn = isTextChannelInstance;
  expect(testFn(voiceChannel)).toBe(true);
  expect(testFn(stageChannel)).toBe(true);
  expect(testFn(textChannel)).toBe(true);
  expect(testFn(threadChannel)).toBe(true);
  expect(testFn(forumChannel)).toBe(false);
  expect(testFn(message)).toBe(false);
  expect(testFn(guild)).toBe(false);
  expect(testFn(client)).toBe(false);
  expect(testFn(client.user)).toBe(false);
  expect(testFn(clientMember)).toBe(false);
  expect(testFn(botVoiceState)).toBe(false);
  expect(testFn(userVoiceState)).toBe(false);
});

test("isMemberInstance()", () => {
  const testFn = isMemberInstance;
  expect(testFn(voiceChannel)).toBe(false);
  expect(testFn(stageChannel)).toBe(false);
  expect(testFn(textChannel)).toBe(false);
  expect(testFn(threadChannel)).toBe(false);
  expect(testFn(forumChannel)).toBe(false);
  expect(testFn(message)).toBe(false);
  expect(testFn(guild)).toBe(false);
  expect(testFn(client)).toBe(false);
  expect(testFn(client.user)).toBe(false);
  expect(testFn(clientMember)).toBe(true);
  expect(testFn(botVoiceState)).toBe(false);
  expect(testFn(userVoiceState)).toBe(false);
});

test("resolveGuildID()", () => {
  const voice = new Voice({} as any, voiceChannel);
  const gId = "737499502763704370";
  // @ts-expect-error
  voice.id = gId;
  const testFn = resolveGuildId;
  expect(testFn(voice)).toBe(gId);
  expect(testFn(voiceChannel)).toBe(gId);
  expect(testFn(stageChannel)).toBe(gId);
  expect(testFn(textChannel)).toBe(gId);
  expect(testFn(threadChannel)).toBe(gId);
  expect(testFn(forumChannel)).toBe(gId);
  expect(testFn(message)).toBe(gId);
  expect(testFn(guild)).toBe(gId);
  expect(testFn(clientMember)).toBe(gId);
  expect(testFn(botVoiceState)).toBe(gId);
  expect(testFn(userVoiceState)).toBe(gId);
  expect(testFn(gId)).toBe(gId);
  expect(() => testFn(client as any)).toThrow(new DisTubeError("INVALID_TYPE", "GuildIdResolvable", client));
  expect(() => testFn(client.user as any)).toThrow(new DisTubeError("INVALID_TYPE", "GuildIdResolvable", client.user));
  expect(() => testFn(1 as any)).toThrow(new DisTubeError("INVALID_TYPE", "GuildIdResolvable", 1));
});

test("isClientInstance()", () => {
  const testFn = isClientInstance;
  expect(testFn(voiceChannel)).toBe(false);
  expect(testFn(stageChannel)).toBe(false);
  expect(testFn(textChannel)).toBe(false);
  expect(testFn(threadChannel)).toBe(false);
  expect(testFn(forumChannel)).toBe(false);
  expect(testFn(message)).toBe(false);
  expect(testFn(guild)).toBe(false);
  expect(testFn(client)).toBe(true);
  expect(testFn(client.user)).toBe(false);
  expect(testFn(clientMember)).toBe(false);
  expect(testFn(botVoiceState)).toBe(false);
  expect(testFn(userVoiceState)).toBe(false);
});

test("isNsfwChannel()", () => {
  const testFn = isNsfwChannel;
  expect(testFn(voiceChannel)).toBe(true);
  expect(testFn(stageChannel)).toBe(false);
  expect(testFn(textChannel)).toBe(false);
  expect(testFn(threadChannel)).toBe(true);
  expect(testFn(forumChannel)).toBe(false); // is not a text channel
  expect(testFn(message)).toBe(false);
  expect(testFn(guild)).toBe(false);
  expect(testFn(<any>client)).toBe(false);
  expect(testFn(<any>client.user)).toBe(false);
  expect(testFn(clientMember)).toBe(false);
  expect(testFn(botVoiceState)).toBe(false);
  expect(testFn(userVoiceState)).toBe(false);
});

test("isVoiceChannelEmpty()", () => {
  const testFn = isVoiceChannelEmpty;
  expect(testFn({ client: {} } as any)).toBe(false);
  expect(testFn({ guild: true, client: {} } as any)).toBe(false);
  expect(testFn(voiceChannel as any)).toBe(false);
  expect(testFn(botVoiceState)).toBe(false);
  guild.voiceStates.cache.set(botVoiceState.id, botVoiceState);
  expect(testFn(botVoiceState)).toBe(true);
  guild.voiceStates.cache.set(userVoiceState.id, userVoiceState);
  expect(testFn(botVoiceState)).toBe(false);
});

test("checkIntents()", () => {
  const intent = "GuildVoiceStates";
  const client1 = new Client({ intents: [] });
  const client2 = new Client({ intents: ["Guilds"] });
  const client3 = new Client({ intents: [intent] });
  expect(() => {
    checkIntents(client1.options);
  }).toThrow(new DisTubeError("MISSING_INTENTS", intent));
  expect(() => {
    checkIntents(client2.options);
  }).toThrow(new DisTubeError("MISSING_INTENTS", intent));
  expect(checkIntents(client3.options)).toBeUndefined();
});

test("isURL()", () => {
  expect(isURL(1)).toBe(false);
  expect(isURL("")).toBe(false);
  expect(isURL("not an url")).toBe(false);
  expect(isURL("https://")).toBe(false);
  expect(isURL("file://abc")).toBe(true);
  expect(isURL("sftp://abc")).toBe(false);
  expect(isURL("ftp://abc")).toBe(false);
  expect(isURL("ahihi://abc")).toBe(false);
  expect(isURL("http://localhost:1234")).toBe(true);
  expect(isURL("https://distube.js.org/")).toBe(true);
  expect(isURL("http://distube.js.org:433")).toBe(true);
});

test("formatDuration()", () => {
  expect(formatDuration(undefined as any)).toBe("00:00");
  expect(formatDuration(0)).toBe("00:00");
  expect(formatDuration(1)).toBe("00:01");
  expect(formatDuration(59.99)).toBe("00:59");
  expect(formatDuration(60.99)).toBe("01:00");
  expect(formatDuration(70.6)).toBe("01:10");
  expect(formatDuration(3600.99)).toBe("01:00:00");
  expect(formatDuration(5025)).toBe("01:23:45");
  expect(formatDuration(7199.99)).toBe("01:59:59");
  expect(formatDuration(91425)).toBe("25:23:45");
});

test("checkInvalidKey()", () => {
  const target = {
    a: 0,
    b: 1,
  };
  const name = "target";
  expect(() => checkInvalidKey(0 as any, [], name)).toThrow(new DisTubeError("INVALID_TYPE", "object", 0, name));
  expect(() => checkInvalidKey(target, ["b"], name)).toThrow(`'a' does not need to be provided in ${name}`);
  expect(() => checkInvalidKey(target, { a: undefined }, name)).toThrow(`'b' does not need to be provided in ${name}`);
  expect(checkInvalidKey(target, { a: 0, b: 0, c: 0 }, name)).toBeUndefined();
  expect(checkInvalidKey(target, ["a", "b"], name)).toBeUndefined();
});
