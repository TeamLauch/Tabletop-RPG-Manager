
import { PDFDocument, rgb } from 'pdf-lib'
import { getFieldData } from './dataHelper';

/**
 * 
 * @param data Character Data
 * @returns A Converted Character for Use in fill Methode
 */
export function createCharacterForFill(data : any) : {
    name: string,
    hp: number,
    rk: number,
    init: number,
    wuerfelName: string,
    volkName: string,
    className: string,
    portrait: string,
    rettungsUbung: string[],
    ubungsbonus: number,
    fahigkeitenUbung: string[],
    weapontypsUbung: string[],
    protectiontypsUbung: string[],
    languages: string[],
    personlichkeisMerkmal: string,
    money: {
        pm: number,
        gm: number,
        em: number,
        sm: number,
        km: number,
    },
    makel: string,
    ideale: string,
    bindungen: string,
    hintergrund: string,
    alter: number,
    religion: string,
    korperGrose: string,
    geschlecht: string,
    gesinnung: string,
    augenfarbe: string,
    haarfarbe: string,
    hautfarbe: string,
    aussehen: string,
    werdegang: string,
    zauber: string[],
    spells: string[],
    weapons: any[],
    inventory: any[],
    stufe: number, 
    hintergrundGeschichte: string,
    wurfelAnzahl: number,
    zauberSlots: any,    
    attributes: any,
    abilities: string[],
    bewegungsrate: string,
    zauberAttribute: string,
}{


    return {
        name: data.characterName,
        hp: Number.parseInt(data.hp),
        rk: Number.parseInt(data.rk),
        init: 0,
        wuerfelName: getFieldData(data, "data.dice.default"),
        volkName: data.volk,
        className: data.class,
        portrait: "",
        rettungsUbung: data.ubungRW,
        alter: data.alter,
        abilities: getFieldData(data, "data.abilities"),
        attributes: data.attributes,
        augenfarbe: data.augenfarbe,
        aussehen: data.aussehen,
        bewegungsrate: getFieldData(data, "data.bewegungsrate"),
        bindungen: data.bindungen,
        fahigkeitenUbung: data.ubungAB,
        geschlecht: data.geschlecht,
        gesinnung: data.gesinnung,
        haarfarbe: data.haarfarbe,
        hautfarbe: data.hautfarbe,
        hintergrund: data.hintergrund,
        hintergrundGeschichte: data.hintergrundGeschichte,
        ideale: data.ideale,
        inventory: [],
        korperGrose: "",
        languages: data.languages,
        makel: data.makel,
        money: data.money,
        personlichkeisMerkmal: "",
        protectiontypsUbung: [],
        religion: data.religion,
        spells: getFieldData(data, "data.magic.spells"),
        stufe: getFieldData(data, "data.level"),
        ubungsbonus: getFieldData(data, "ubungsBonus"),
        weapons: [],
        weapontypsUbung: [],
        werdegang: data.werdegang,
        wurfelAnzahl: getFieldData(data, "data.dice.amount"),
        zauberSlots: getFieldData(data, "data.magic.slot"),
        zauberAttribute: getFieldData(data, "data.magic.attribute"),
        zauber: getFieldData(data, "data.magic.spells")

    }
}

/**
 * 
 * @todo MAKE USEABLE
 * 
 * @param character Character Data
 * @param saveBytes To Save PDF
 * @param abilities Abilieties
 * @param spells Spells
 * @param attribute Attributes
 * @returns PDF
 */
export async function fillCharacterSheet(character : {
    name: string,
    hp: number,
    rk: number,
    init: number,
    wuerfelName: string,
    volkName: string,
    className: string,
    portrait: string,
    rettungsUbung: string[],
    ubungsbonus: number,
    fahigkeitenUbung: string[],
    weapontypsUbung: string[],
    protectiontypsUbung: string[],
    languages: string[],
    personlichkeisMerkmal: string,
    money: {
        pm: number,
        gm: number,
        em: number,
        sm: number,
        km: number,
    },
    makel: string,
    ideale: string,
    bindungen: string,
    hintergrund: string,
    alter: number,
    religion: string,
    korperGrose: string,
    geschlecht: string,
    gesinnung: string,
    augenfarbe: string,
    haarfarbe: string,
    hautfarbe: string,
    aussehen: string,
    werdegang: string,
    spells: string[],
    weapons: any[],
    inventory: any[],
    zauber: string[],
    stufe: number, 
    hintergrundGeschichte: string,
    wurfelAnzahl: number,
    zauberSlots: any,
    attributes: any,
    zauberAttribute: string,
    abilities: string[],
    bewegungsrate: string,
}, saveBytes : any, abilities : any, spells : any, attribute : any){

    const pdfUrl = "/blankForm.pdf";
    const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    form.getTextField("Charaktername_page1").setText(character.name);
    form.getTextField("Charaktername_page2").setText(character.name);
    form.getTextField("KlasseUndStufe").setText(character.className + " " + character.stufe);
    form.getTextField("Hintergrund").setText(character.hintergrund);
    form.getTextField("Volk").setText(character.volkName);


    form.getTextField("Str").setText(character.attributes["sta"] ? character.attributes["sta"] + "" : "0");
    form.getTextField("Ges").setText(character.attributes["ges"] ? character.attributes["ges"] + "" : "0");
    form.getTextField("Kon").setText(character.attributes["kon"] ? character.attributes["kon"]+ "" : "0");
    form.getTextField("Int").setText(character.attributes["int"] ? character.attributes["int"] + "": "0");
    form.getTextField("Wei").setText(character.attributes["wei"] ? character.attributes["wei"]+ "" : "0");
    form.getTextField("Cha").setText(character.attributes["cha"] ? character.attributes["cha"] + "": "0");

    form.getTextField("Übungsbonus").setText(character.ubungsbonus.toString());
    form.getTextField("Rüstungsklasse").setText(character.rk.toString());
    form.getTextField("Initiative").setText(character.init.toString());
    form.getTextField("Bewegungsrate").setText(character.bewegungsrate);

    form.getTextField("TrefferpunkteMaximum").setText(character.hp.toString());
    form.getTextField("GesamtTW").setText(character.wurfelAnzahl + character.wuerfelName)

    form.getTextField("Persönlichkeitsmerkmale").setText(character.personlichkeisMerkmal);
    form.getTextField("Ideale").setText(character.ideale);
    form.getTextField("Bindungen").setText(character.bindungen);
    form.getTextField("Makel").setText(character.makel);

    let i = 1;
    for(const w of character.weapons){
        form.getTextField("Angriff"+i).setText(w.name);
        if(w.ub){
            form.getCheckBox("ÜB"+i).check();
        }
        form.getDropdown("Attr"+i).select(w.attribute);
        form.getTextField("Reichweite"+i).setText(w.range);
        let b = w.ub? character.ubungsbonus : 0;
        switch(w.attribute){
            case "Stä":
                b += b + Math.floor(Number.parseInt(character.attributes["sta"])/2-5);
                break;
            case "Ges":
                b +=  Math.floor(Number.parseInt(character.attributes["ges"])/2-5);
                break;
            case "Kon":
                b += Math.floor(Number.parseInt(character.attributes["kon"])/2-5);
                break;
            case "Int":
                b += Math.floor(Number.parseInt(character.attributes["int"])/2-5);
                break;
            case "Cha":
                b += Math.floor(Number.parseInt(character.attributes["wei"])/2-5);
                break;
            case "Wei":
                b += Math.floor(Number.parseInt(character.attributes["cha"])/2-5);
                break;
        }
        form.getTextField("Bonus"+i).setText("" +b);
        form.getTextField("Schaden"+i).setText(w.damage);
        form.getTextField("Schadentyp"+i).setText(w.damageType);
        if(i == 5)
            break;
        i++;
    }
    i = 1;
    for(const l of character.languages){
        form.getTextField("Sprache"+i).setText(l);
        if(i == 6)
            break;
        i++;
    }

    let s1 = "";
    let s2 = ""
    for(const a of abilities){
        if(!character.abilities.includes(a.name)){
            continue;
        }
        if(s1.length < 700){
            s1 += a.name + ":" + "\n";
            s1 += a.description;
            s1 +="\n\n";
            continue;
        }
        s2 += a.name + ":" + "\n";
        s2 += a.description;
        s2 +="\n\n";
        
    }
    const merkmale1 = form.getTextField("Klassenmerkmale1");
    merkmale1.setText(s1);
    merkmale1.setFontSize(9);
    const merkmale2 = form.getTextField("Klassenmerkmale2");
    merkmale2.setText(s2);
    merkmale2.setFontSize(9);

    i = 1;
    for(const it of character.inventory){
        
        form.getTextField("Inventar"+1).setText(it.name+ "");
        form.getTextField("InventarAnz"+1).setText(it.amount+ "");
        form.getTextField("InventarGew"+1).setText(it.weight ? it.weight+ "" : "0");
        if(i == 38)
            break;
        i++;
    }


    form.getTextField("Alter").setText("" +character.alter);
    form.getTextField("Glaube").setText(character.religion);
    form.getTextField("Körpergrösse").setText(character.korperGrose);
    form.getTextField("Geschlecht").setText(character.geschlecht);
    form.getTextField("Gesinnung").setText(character.gesinnung.split("_").map((word : string) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" "));
    form.getTextField("Augenfarbe").setText(character.augenfarbe);
    form.getTextField("Haarfarbe").setText(character.haarfarbe);
    form.getTextField("Hautfarbe").setText(character.hautfarbe);

    form.getTextField("Aussehen").setText(character.aussehen);
    form.getTextField("Hintergrundgeschichte1").setText(character.hintergrundGeschichte);
    form.getTextField("Werdegang1").setText(character.werdegang);


    for(const a of character.fahigkeitenUbung){
        const words = a.split(" ");

        let s = words.map((word : string) => { 
            return word[0].toUpperCase() + word.substring(1); 
        }).join("");

        form.getCheckBox(s+"Prof").check();
    }

    for(const a of character.rettungsUbung){
        switch(a){
            case "Stärke":
                form.getCheckBox("StrProf").check();
                break;
            case "Geschicklichkeit":
                form.getCheckBox("GesProf").check();
                break;
            case "Konstitution":
                form.getCheckBox("KonProf").check();
                break;
            case "Inteligenz":
                form.getCheckBox("IntProf").check();
                break;
            case "Weisheit":
                form.getCheckBox("WeiProf").check();
                break;
            case "Charisma":
                form.getCheckBox("ChaProf").check();
                break;
        }
    }

    let attr : any = {};
    for(let a of attribute){
        if(a.name == character.zauberAttribute){
            attr = a;
        }
    }

    if(!character.zauber){
        const modifiedPdfBytes = await pdfDoc.save();

        saveBytes(modifiedPdfBytes);
        return;
    }

    let newSpells : any = {};
    for(let j = 0; j<=9; j++){
        for(let spell of spells){
            if(spell.level == j && character.zauber.includes(spell.name)){
                if(!newSpells[j]){
                    newSpells = {...newSpells, [j]: [spell]}
                    continue;
                }
                newSpells = {...newSpells, [j]: [...newSpells[j], spell]}
            }
        }
    }

    i = 1;
    for(let j = 0; j <= 9; j++){
        if(!newSpells[j]){
            if(j != 0){
                form.getTextField("ZauberplätzeGesamt"+j).setText((character.zauberSlots[j] ?? 0) +"");
            }
            continue;
        }
        for(const s of newSpells[j]){
            let field = j != 0 ? "Zauber"+j+"_"+i : "Zaubertrick"+i;
            form.getTextField(field).setText(s.name);
            if((j == 0 && i >= 8) || i >= 13){
                break;
            }
            i++;
        }
        i=1;
        if(j != 0){
            form.getTextField("ZauberplätzeGesamt"+j).setText((character.zauberSlots[j] ?? 0) +"");
        }
    }

    if(!attr){
        form.getTextField("AttributZauberwirken").setText(attr.shortName ?? "");
        form.getTextField("ZauberRettungswurfSG").setText(attr.shortName ? (8 + character.ubungsbonus + Math.floor(Number.parseInt(character.attributes[attr.shortName.toLowerCase()])/2)-5).toString() : "")
        form.getTextField("ZauberAngriffsbonus").setText(attr.shortName ? (character.ubungsbonus + Math.floor(Number.parseInt(character.attributes[attr.shortName.toLowerCase()])/2)-5).toString() : "")
    }
    form.getTextField("Zauberklasse").setText(character.className);
    

    
    const modifiedPdfBytes = await pdfDoc.save();

    saveBytes(modifiedPdfBytes);
}