import * as React from "react";
import { useForm } from "react-hook-form";
import type { IUserPet } from "shared/models/user";

import { useAuth } from "../auth";

const animalTypes = [
  "Aardvark",
  "Aardwolf",
  "African buffalo",
  "African elephant",
  "African leopard",
  "Albatross",
  "Alligator",
  "Alpaca",
  "American buffalo (bison)",
  "American robin",
  "Amphibian",
  "Anaconda",
  "Angelfish",
  "Anglerfish",
  "Animals by number of neurons",
  "Animals by size",
  "Ant",
  "Anteater",
  "Antelope",
  "Antlion",
  "Ape",
  "Aphid",
  "Arabian leopard",
  "Arctic Fox",
  "Arctic Wolf",
  "Armadillo",
  "Arrow crab",
  "Asp",
  "Ass (donkey)",
  "Baboon",
  "Badger",
  "Bald eagle",
  "Bali cattle",
  "Bandicoot",
  "Barnacle",
  "Barracuda",
  "Basilisk",
  "Bass",
  "Bat",
  "Beaked whale",
  "Bear",
  "Beaver",
  "Bedbug",
  "Bee",
  "Beetle",
  "Bird",
  "Bison",
  "Black panther",
  "Black widow spider",
  "Blackbird",
  "Blue bird",
  "Blue jay",
  "Blue whale",
  "Boa",
  "Boar",
  "Bobcat",
  "Bobolink",
  "Bonobo",
  "Booby",
  "Bovid",
  "Box jellyfish",
  "Buffalo, African",
  "Buffalo, American (bison)",
  "Bug",
  "Butterfly",
  "Buzzard",
  "Camel",
  "Canid",
  "Canidae",
  "Cape buffalo",
  "Capybara",
  "Cardinal",
  "Caribou",
  "Carp",
  "Cat",
  "Caterpillar",
  "Catfish",
  "Catshark",
  "Cattle",
  "Centipede",
  "Cephalopod",
  "Chameleon",
  "Cheetah",
  "Chickadee",
  "Chicken",
  "Chicken breeds",
  "Chimpanzee",
  "Chinchilla",
  "Chipmunk",
  "Cicada",
  "Clam",
  "Clownfish",
  "Cobra",
  "Cockroach",
  "Cod",
  "Common household pests",
  "Common names of poisonous animals",
  "Condor",
  "Constrictor",
  "Coral",
  "Cougar",
  "Cow",
  "Coyote",
  "Crab",
  "Crane",
  "Crane fly",
  "Crawdad",
  "Crayfish",
  "Cricket",
  "Crocodile",
  "Crow",
  "Cuckoo",
  "Damselfly",
  "Deer",
  "Dingo",
  "Dinosaur",
  "Dog",
  "Dolphin",
  "Domestic Bactrian camel",
  "Domestic canary",
  "Domestic dromedary camel",
  "Domestic duck",
  "Domestic goat",
  "Domestic goose",
  "Domestic guineafowl",
  "Domestic hedgehog",
  "Domestic pig",
  "Domestic pigeon",
  "Domestic rabbit",
  "Domestic silkmoth",
  "Domestic silver fox",
  "Domestic turkey",
  "Donkey",
  "Dormouse",
  "Dove",
  "Dragon",
  "Dragonfly",
  "Duck",
  "Duck breeds",
  "Dung beetle",
  "Eagle",
  "Earthworm",
  "Earwig",
  "Echidna",
  "Eel",
  "Egret",
  "Elephant",
  "Elephant seal",
  "Elk",
  "Emu",
  "English pointer",
  "Ermine",
  "Falcon",
  "Fancy mouse",
  "Fancy rat",
  "Fancy rat varieties",
  "Felidae",
  "Ferret",
  "Finch",
  "Firefly",
  "Fish",
  "Flamingo",
  "Flea",
  "Fly",
  "Flyingfish",
  "Fowl",
  "Fox",
  "Frog",
  "Fruit bat",
  "Galliform",
  "Gamefowl",
  "Gayal",
  "Gazelle",
  "Gecko",
  "Gerbil",
  "Giant panda",
  "Giant squid",
  "Gibbon",
  "Gila monster",
  "Giraffe",
  "Goat",
  "Goldfish",
  "Goose",
  "Goose breeds",
  "Gopher",
  "Gorilla",
  "Grasshopper",
  "Great blue heron",
  "Great white shark",
  "Grizzly bear",
  "Ground shark",
  "Ground sloth",
  "Grouse",
  "Guan",
  "Guanaco",
  "Guinea pig",
  "Guineafowl",
  "Gull",
  "Guppy",
  "Haddock",
  "Halibut",
  "Hammerhead shark",
  "Hamster",
  "Hare",
  "Harrier",
  "Hawk",
  "Hedgehog",
  "Hermit crab",
  "Heron",
  "Herring",
  "Hippopotamus",
  "Hookworm",
  "Hornet",
  "Horse",
  "Hoverfly",
  "Hummingbird",
  "Humpback whale",
  "Hyena",
  "Iguana",
  "Impala",
  "Irukandji jellyfish",
  "Jackal",
  "Jaguar",
  "Jay",
  "Jellyfish",
  "Junglefowl",
  "Kangaroo",
  "Kangaroo mouse",
  "Kangaroo rat",
  "Kingfisher",
  "Kite",
  "Kiwi",
  "Koala",
  "Koi",
  "Komodo dragon",
  "Krill",
  "Lab rat",
  "Ladybug",
  "Lamprey",
  "Land snail",
  "Landfowl",
  "Lark",
  "Leech",
  "Lemming",
  "Lemur",
  "Leopard",
  "Leopon",
  "Limpet",
  "Lion",
  "Lizard",
  "Llama",
  "Lobster",
  "Locust",
  "Loon",
  "Louse",
  "Lungfish",
  "Lynx",
  "Macaw",
  "Mackerel",
  "Magpie",
  "Mammal",
  "Manatee",
  "Mandrill",
  "Manta ray",
  "Marlin",
  "Marmoset",
  "Marmot",
  "Marsupial",
  "Marten",
  "Mastodon",
  "Meadowlark",
  "Meerkat",
  "Mink",
  "Minnow",
  "Mite",
  "Mockingbird",
  "Mole",
  "Mollusk",
  "Mongoose",
  "Monitor lizard",
  "Monkey",
  "Moose",
  "Mosquito",
  "Moth",
  "Mountain goat",
  "Mouse",
  "Mule",
  "Muskox",
  "Narwhal",
  "New World quail",
  "Newt",
  "Nightingale",
  "Ocelot",
  "Octopus",
  "Old World quail",
  "Opossum",
  "Orangutan",
  "Orca",
  "Ostrich",
  "Otter",
  "Owl",
  "Ox",
  "Panda",
  "Panther",
  "Panthera hybrid",
  "Parakeet",
  "Parrot",
  "Parrotfish",
  "Partridge",
  "Peacock",
  "Peafowl",
  "Pelican",
  "Penguin",
  "Perch",
  "Peregrine falcon",
  "Pheasant",
  "Pig",
  "Pigeon",
  "Pigeon breeds",
  "Pike",
  "Pilot whale",
  "Pinniped",
  "Piranha",
  "Planarian",
  "Platypus",
  "Polar bear",
  "Pony",
  "Porcupine",
  "Porpoise",
  "Portuguese man o' war",
  "Possum",
  "Prairie dog",
  "Prawn",
  "Praying mantis",
  "Primate",
  "Ptarmigan",
  "Puffin",
  "Puma",
  "Python",
  "Quail",
  "Quelea",
  "Quokka",
  "Rabbit",
  "Raccoon",
  "Rainbow trout",
  "Rat",
  "Rattlesnake",
  "Raven",
  "Ray (Batoidea)",
  "Ray (Rajiformes)",
  "Red panda",
  "Reindeer",
  "Reptile",
  "Rhinoceros",
  "Right whale",
  "Ringneck dove",
  "Roadrunner",
  "Rodent",
  "Rook",
  "Rooster",
  "Roundworm",
  "Saber-toothed cat",
  "Sailfish",
  "Salamander",
  "Salmon",
  "Sawfish",
  "Scale insect",
  "Scallop",
  "Scorpion",
  "Sea lion",
  "Sea slug",
  "Sea snail",
  "Seahorse",
  "Shark",
  "Sheep",
  "Sheep breeds",
  "Shrew",
  "Shrimp",
  "Siamese fighting fish",
  "Silkworm",
  "Silverfish",
  "Skink",
  "Skunk",
  "Sloth",
  "Slug",
  "Smelt",
  "Snail",
  "Snake",
  "Snipe",
  "Snow leopard",
  "Society finch",
  "Sockeye salmon",
  "Sole",
  "Sparrow",
  "Sperm whale",
  "Spider",
  "Spider monkey",
  "Spoonbill",
  "Squid",
  "Squirrel",
  "Star-nosed mole",
  "Starfish",
  "Steelhead trout",
  "Stingray",
  "Stoat",
  "Stork",
  "Sturgeon",
  "Sugar glider",
  "Swallow",
  "Swan",
  "Swift",
  "Swordfish",
  "Swordtail",
  "Tahr",
  "Takin",
  "Tapir",
  "Tarantula",
  "Tarsier",
  "Tasmanian devil",
  "Termite",
  "Tern",
  "Thrush",
  "Tick",
  "Tiger",
  "Tiger shark",
  "Tiglon",
  "Toad",
  "Tortoise",
  "Toucan",
  "Trapdoor spider",
  "Tree frog",
  "Trout",
  "Tuna",
  "Turkey",
  "Turkey breeds",
  "Turtle",
  "Tyrannosaurus",
  "Urial",
  "Vampire bat",
  "Vampire squid",
  "Vicuna",
  "Viper",
  "Vole",
  "Vulture",
  "Wallaby",
  "Walrus",
  "Warbler",
  "Wasp",
  "Water Boa",
  "Water buffalo",
  "Water buffalo breeds",
  "Weasel",
  "Whale",
  "Whippet",
  "Whitefish",
  "Whooping crane",
  "Wildcat",
  "Wildebeest",
  "Wildfowl",
  "Wolf",
  "Wolverine",
  "Wombat",
  "Woodpecker",
  "Worm",
  "Wren",
  "X-ray fish",
  "Xerinae",
  "Yak",
  "Yellow perch",
  "Zebra",
  "Zebra finch",
  "laboratory rat strains",
  "list",
].sort();

export interface PetsProps {
  pets: IUserPet[];
  id: string;
  update: (pets: IUserPet[]) => void;
  isLoading: boolean;
}

const Pets: React.FC<PetsProps> = ({ pets, id, update, isLoading }) => {
  const [{ authenticated, user }] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IUserPet>({ defaultValues: { type: "Cat" } });

  const customOnAdd = (pet: IUserPet) => {
    update([...pets, pet] as any);
  };

  return (
    <div className="is-flex is-flex-direction-column my-6">
      {pets.length > 0 && (
        <>
          <h2 className="title my-3">
            {authenticated && user!._id == id ? "My" : "Their"} pets
          </h2>
          {pets.map((pet, i) => (
            <div
              key={i}
              className="is-flex is-flex-direction-row is-justify-content-space-between"
            >
              <h4 className="subtitle is-6">{pet.name}</h4>
              <span className="subtitle is-6">{pet.type}</span>
              <span className="subtitle is-6">
                {pet.sex} - {pet.age} years old
              </span>
              <button
                className="delete"
                aria-label="Remove pet"
                onClick={(_) => update(pets.filter((_, j) => j != i))}
              ></button>
            </div>
          ))}
        </>
      )}
      {authenticated && user!._id == id && (
        <>
          <h3 className="subtitle my-3">Add a new pet</h3>
          <form onSubmit={handleSubmit(customOnAdd)}>
            <div className="is-flex is-flex-direction-column">
              <div>
                <input
                  className="input"
                  placeholder="Name"
                  aria-label="Name"
                  type="text"
                  id="name"
                  disabled={isLoading}
                  {...register("name", { required: true })}
                />
                {formErrors.name && (
                  <span className="help is-danger">A pet name is required</span>
                )}
              </div>
              <div className="select mt-4">
                <select
                  className="input"
                  placeholder="Animal type"
                  aria-label="Animal type"
                  id="type"
                  disabled={isLoading}
                  {...register("type", { required: true })}
                >
                  {animalTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.type && (
                  <span className="help is-danger">
                    An animal type like chimp, dog, etc is required
                  </span>
                )}
              </div>
              <div className="select mt-4">
                <select
                  className="input"
                  placeholder="Animal sex"
                  aria-label="Animal sex"
                  id="sex"
                  disabled={isLoading}
                  {...register("sex", { required: true })}
                >
                  <option value="male">not given</option>
                  <option value="male">male</option>
                  <option value="fema">female</option>
                </select>

                {formErrors.sex && (
                  <span className="help is-danger">
                    The animal sex must be described
                  </span>
                )}
              </div>
              <div className="mt-4">
                <input
                  type="number"
                  increment="1"
                  className="input"
                  placeholder="Animal age (in years)"
                  aria-label="Animal age (in years)"
                  id="age"
                  disabled={isLoading}
                  {...register("age", {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                  })}
                />

                {formErrors.sex && (
                  <span className="help is-danger">
                    The animal age must be provided
                  </span>
                )}
              </div>

              <div
                className="mt-4 is-flex is-justify-content-end"
                style={{ width: "100%" }}
              >
                <button className="button is-success" disabled={isLoading}>
                  Save
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Pets;
