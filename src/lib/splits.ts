import splits from "../asset/splits.txt";
import Icons from "../asset/icons/icons";

// const SPLITS_DEFINITIONS_FILE = "./asset/splits.txt";
const SPLITS_DEFINITIONS_REGEXP =
    /\[Description\("(?<description>.+)"\), ToolTip\("(?<tooltip>.+)"\)\]\s+(?<id>\w+),/g;
export const DESCRIPTION_NAME_REGEXP = /(?<name>.+)\s+\((?<qualifier>.+)\)/;

export interface SplitDefinition {
    description: string;
    tooltip: string;
    id: string;
    name: string;
    group: string;
}

function getNameAndGroup({ description, id, }: Pick<SplitDefinition, "description"|"id">): [string, string] {
    const match = DESCRIPTION_NAME_REGEXP.exec(description);
    if (!match) {
        throw new Error(`Invalid Description: ${description}`);
    }
    if (!match.groups) {
        throw new Error("RegExp match must have groups");
    }

    const { name, qualifier, } = match.groups;

    switch (qualifier) {
        case "Charm Notch":
            return [`${name} Notch`, qualifier];
        case "Stag Station":
            return [`${name} Stag`, qualifier];
        case "Grub": {
            return [name.substr("Rescued ".length), qualifier];
        }
        case "Transition":
            switch (id) {
                case "BasinEntry":
                case "CrystalPeakEntry":
                case "FogCanyonEntry":
                case "EnterGreenpath":
                case "EnterGreenpathWithOvercharm":
                case "HiveEntry":
                case "KingdomsEdgeEntry":
                case "KingdomsEdgeOvercharmedEntry":
                case "EnterNKG":
                case "EnterSanctum":
                case "EnterSanctumWithShadeSoul":
                case "Pantheon1to4Entry":
                case "Pantheon5Entry":
                case "WaterwaysEntry": {
                    return [`Enter ${name}`, qualifier];
                }
                case "QueensGardensEntry": {
                    return ["Enter Queen's Gardens", qualifier];
                }
                default: break;
            }
            break;
        case "Essence": {
            return [`${name} Essence`, qualifier];
        }
        case "Boss":
            switch (id) {
                case "RadianceBoss":
                case "HollowKnightBoss": {
                    return [name, "Practice"];
                }
                default: break;
            }
            break;
        case "Obtain":
            if (/Dream Nail/.test(name)) {
                return [name, "Essence"];
            }
            return [name, "Item"];
        default: {
            break;
        }
    }

    switch (name) {
        case "Whispering Root": {
            // qualifier is the area
            return [`${qualifier} Root`, "Whispering Root"];
        }
        default: break;
    }

    switch (id) {
        case "DreamNail2": {
            return ["Awoken Dream Nail", qualifier];
        }
        case "CrystalGuardian1": {
            return ["Crystal Guardian", qualifier];
        }
        case "CrystalGuardian2": {
            return ["Enraged Guardian", qualifier];
        }
        case "UnchainedHollowKnight": {
            return ["Hollow Knight Scream", qualifier];
        }
        case "HollowKnightDreamnail": {
            return ["Hollow Knight", qualifier];
        }
        case "ColosseumBronze": {
            return ["Trial of the Warrior", qualifier];
        }
        case "ColosseumSilver": {
            return ["Trial of the Conqueror", qualifier];
        }
        case "ColosseumGold": {
            return ["Trial of the Fool", qualifier];
        }
        case "Pantheon1": {
            return ["Pantheon of the Master", qualifier];
        }
        case "Pantheon2": {
            return ["Pantheon of the Artist", qualifier];
        }
        case "Pantheon3": {
            return ["Pantheon of the Sage", qualifier];
        }
        case "Pantheon4": {
            return ["Pantheon of the Knight", qualifier];
        }
        case "Pantheon5": {
            return ["Pantheon of Hallownest", qualifier];
        }
        case "AspidHunter": {
            return ["Aspid Arena", qualifier];
        }
        case "HuskMiner": {
            return ["Myla", qualifier];
        }
        case "WhiteFragmentLeft": {
            return ["Queen Fragment", qualifier];
        }
        case "WhiteFragmentRight": {
            return ["King Fragment", qualifier];
        }
        case "Zote1": {
            return ["Vengefly King (Zote)", qualifier];
        }
        case "MegaMossCharger": {
            return ["Massive Moss Charger", qualifier];
        }
        case "NightmareLanternDestroyed": {
            return ["Banishment", qualifier];
        }
        default: {
            break;
        }
    }

    return [name, qualifier];
}

export function parseSplitsDefinitions(): Map<string, SplitDefinition> {
    const matches = splits.matchAll(SPLITS_DEFINITIONS_REGEXP);
    const definitions = new Map<string, SplitDefinition>();
    for (const match of matches) {
        if (!match.groups) {
            throw new Error("RegExp match must have groups");
        }

        const {
            description,
            id,
            tooltip,
        } = match.groups;
        const [name, group] = getNameAndGroup({ description, id, });
        definitions.set(id, {
            description,
            id,
            tooltip,
            name,
            group,
        });
    }

    return definitions;
}

export function getIconURLs(): Map<string, string> {
    const result = new Map<string, string>();
    for (const [key, url] of Object.entries(Icons)) {
        result.set(key, url);
    }
    return result;
}

// export async function getIconData(name: string): Promise<Map<string, string>> {
//     assertIsIconClass(name);
//     const icons = await Icons[name]();
//     return new Map(Object.entries(icons));
// }
