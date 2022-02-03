// Macro do jogo de CHARADA https://charada.vercel.app/

// --------------------------------------------
// --------------- INICIAR --------------------
// --------------------------------------------

// Inicializa constantes do jogo
const alphabet = "AOEISRUMLNCTBPGDFVJZHXQ"; //https://twitter.com/pegab21/status/1487155681325166592
const board = document.getElementsByClassName("flex-grow")[1];
const keyboard = document.getElementsByClassName("flex-grow")[2]; 
let final_word = [];

// Inicia o painel e identifica seu elemento
insert_panel();
const panel = document.getElementById('inject').getElementsByTagName('p')[0];
print_standard_panel();

// --------------------------------------------
// ---------------- QUADRO --------------------
// --------------------------------------------

// Leitura do quadro
function convert_letter_element_to_object (letter_element){
	const letter_object = {
		idx: Array.from(letter_element.parentNode.children).indexOf(letter_element),
		char: letter_element.innerText
	}
	return letter_object;	
}

function convert_letter_element_array_to_object_array (letter_element_array){
	let letter_object_array = [];
	for (let element of letter_element_array){
		letter_object_array.push(convert_letter_element_to_object(element));
	}
	return letter_object_array;
}

function only_chars(letter_object_array){
	let new_string = "";
	for (let obj of letter_object_array){
		new_string += obj.char;
	}
	return new_string;
}

function get_number_of_lines(){
	return board.children.length;
}

function get_number_of_letters(){
	return board.children[0].children.length;
}

function get_greens(){
	const letter_element_array = board.querySelectorAll("div.bg-green-500");
	const letter_object_array = convert_letter_element_array_to_object_array(letter_element_array);
	return letter_object_array;
}

function get_yellows(){
	const letter_element_array = board.querySelectorAll("div.bg-yellow-500");
	const letter_object_array = convert_letter_element_array_to_object_array(letter_element_array);
	return letter_object_array;
}

function get_grays(){
	const letter_element_array = board.querySelectorAll("div.bg-slate-400");
	const letter_object_array = convert_letter_element_array_to_object_array(letter_element_array);
	return letter_object_array;
}

function get_all_panel_words(){
	let all_words = [];
	let word_string = "";
	for (let word_object of board.children){
		letters_list = only_chars(convert_letter_element_array_to_object_array(word_object.getElementsByTagName("div")));
		if (letters_list != ""){all_words.push(letters_list)}
	}
	return all_words;
}

// --------------------------------------------
// ---------------- TECLADO -------------------
// --------------------------------------------

// Leitura do teclado
function get_key_element(letter){
	var elements = keyboard.querySelectorAll("button.flex.items-center.justify-center");
	return Array.prototype.filter.call(elements, function(element){
		return RegExp(letter).test(element.textContent);
	});
}

// Escrita do teclado
function input_word(word){
	for (let letter of word){
		virtual_key = get_key_element(letter)[0].click();
	}
	virtual_key = get_key_element("Enter")[0].click();
}

// --------------------------------------------
// -------------- PALAVRA FINAL ---------------
// --------------------------------------------

// Escrita
function start_final_word(){
	final_word = [];
	for(i=0; i<get_number_of_letters(); i++){
		final_word.push({"avaliable":alphabet});
	}
	filter_all_colors();
}

// Leitura
function get_possible_words(){
	let possible_words = [];
	let avaliable = final_word[final_word.length-1].avaliable;
	let idx = 0;
	for (let char of avaliable){
		possible_words.push(char);
	}
	for (let i=final_word.length-2; i>=0; i--){
		avaliable = final_word[i].avaliable;
		possible_words = duplicateElements(possible_words, avaliable.length);
		for (let j=0; j<possible_words.length; j++){
			idx = j % avaliable.length;
			possible_words[j] = avaliable[idx] + possible_words[j];
		}
	}
	return filter_permutations(possible_words);
}

function duplicateElements(array, times) {
	return array.reduce((res, current) => {
		return res.concat(Array(times).fill(current));
	}, []);
}

function calc_number_of_combinations(){
	let combinations = 1;
	for (let letter of final_word){
		combinations *= letter.avaliable.length;
	}
	return combinations;
}

// Filtros
function filter_all_colors(){
	filter_yellow_letters();
	filter_gray_letters();
}

function filter_green_letters(){
	const greens = get_greens();
	for (let letter of greens){
		final_word[letter.idx].avaliable = letter.char
	} 
}

function filter_yellow_letters(){
	const yellows = get_yellows();
	for (let letter of yellows){
		final_word[letter.idx].avaliable = final_word[letter.idx].avaliable.replace(letter.char,'');
	}
}

function filter_gray_letters(){
	const grays = get_grays();
	for (let letter_gray of grays){
		for (let letter_final of final_word){
			letter_final.avaliable = letter_final.avaliable.replace(letter_gray.char,'')
		}
	}
	filter_green_letters();
}


// --------------------------------------------
// ---------------- ALFABETO ------------------
// --------------------------------------------
function avaliable_letters(){
	const forbidden = forbidden_letters();
	const avaliable = remove_chars(alphabet, forbidden);
	return avaliable;
}

// Manipula chars
function remove_chars(original_stg, stg_to_remove){
	if(stg_to_remove == "" || stg_to_remove == null){return original_stg;}
	let new_stg = "";
	let match = false;
	for (let original_char of original_stg){
		for (let char_to_remove of stg_to_remove){
			if(original_char == char_to_remove){
				match = true;	
			}
		}
		if(!match){new_stg += original_char;}
		match = false;
	}
	return new_stg;
}

function unique_chars(stg){
	return [...new Set(stg)].join('');
}

// Busca letras
function forbidden_letters(){
	const gray = only_chars(get_grays());
	const confirmed = get_confirmed_letters();
	const forbidden = remove_chars(gray , confirmed);
	return forbidden;
}

function get_confirmed_letters(){
	let confirmed_letters = [];
	
	const green_letters = get_greens();
	let new_letter = true;
	for (let green of green_letters){
		for (let confirmed of confirmed_letters){
			if (green.idx == confirmed.idx && green.char == confirmed.char){
				new_letter = false;
			}
		}
		if(new_letter){
			confirmed_letters.push(green);
		}
		new_letter = true;
	}
	
	const yellow_letters = get_yellows();
	new_letter = true;
	for (let yellow of yellow_letters){
		for (let confirmed of confirmed_letters){
			if (yellow.char == confirmed.char){
				new_letter = false;
			}
		}
		if(new_letter){
			confirmed_letters.push(yellow);
		}
		new_letter = true;
	}
	
	return only_chars(confirmed_letters);
}

function unused_letters(){
	const avaliable = avaliable_letters();
	const confirmed = get_confirmed_letters();
	let unused = remove_chars(avaliable, confirmed);
	return unused;
}


// --------------------------------------------
// -------------- PERMUTAÇÕES -----------------
// --------------------------------------------

// Permutações
function get_current_permutations(){
	const letters = get_confirmed_letters();
	const permutations = all_permutations(letters);
	const final_permutations = filter_permutations(permutations);
	return final_permutations;
}

function find_permutations(stg){
	if (!!stg.length && stg.length < 2 ){return stg}
	let permutationsArray = [];
	for (let i=0; i < stg.length; i++){
		let char = stg[i]
		if (stg.indexOf(char) != i)
			continue;
		let remainder = stg.slice(0, i) + stg.slice(i + 1, stg.length);
		for (let permutation of find_permutations(remainder)){
			permutationsArray.push(char + permutation);
		}
	}
	return permutationsArray;
}

function all_permutations(letters){
	while (letters.length < 5){
		letters += "_";
	}
	return find_permutations(letters);
}

// --------------------------------------------
// ---------------- FILTROS -------------------
// --------------------------------------------

//
function filter_permutations(permutations){
	let new_permutations = [];
	
	for (let word of permutations){
		if(contains_confirmed_letters(word) &&
			dont_contains_forbidden_letters(word) &&
			contains_green_on_right_place(word) &&
			dont_contains_yellow_on_right_place(word) &&
			end_well(word) &&
			start_well(word) &&
			dont_contains_bad_letters_combinations(word)
		  ){
			new_permutations.push(word);
		}
	}
	return new_permutations;
}

// Sugestões de palavras
function get_words_sugestions(){
	let words = [];
	return filter_permutations(words);
}

// Juizes de palavras
function contains_confirmed_letters(word){
	let match = true;
	const confirmed = get_confirmed_letters();
	for(let char of confirmed){
		if (!word.includes(char)){
			match = false;
		}
	}
	return match;
}

function dont_contains_forbidden_letters(word){
	let match = true;
	const forbidden = forbidden_letters();
	for(let char of forbidden){
		if (word.includes(char)){
			match = false;
		}
	}
	return match;
}

function contains_green_on_right_place(word){
	let match = true;
	const green = get_greens();
	for(let char of green){
		if (word[char.idx] != char.char){
			match = false;
		}
	}
	return match;
}

function dont_contains_yellow_on_right_place(word){
	let match = true;
	const yellow = get_yellows();
	for(let char of yellow){
		if (word[char.idx] == char.char){
			match = false;
		}
	}
	return match;
}

function end_well(word){
	let match = true;
	const bad_endings = [
		"D", "T", "C", "P", "V", "G", "Q", "B", "F", "J", "H", 
		"AA",                                                                                                 "QA",                               
		"EE",                                                                                           "QE",                               
		"II",                                                                                     "QI",                               
		"OO",                                                                               "QO",                               
		"UU",                                                                         "QU",                               
		"SS",             "DS",                               "VS", "GS", "HS", "QS",       "FS", "ZS", "JS", "XS", 
		"SR", "RR", "NR", "DR", "MR", "TR", "CR", "LR", "PR", "VR", "GR", "HR", "QR", "BR", "FR", "ZR", "JR", "XR", 
		"SN", "RN", "NN", "DN", "MN", "TN", "CN", "LN", "PN", "VN", "GN", "HN", "QN", "BN", "FN", "ZN", "JN", "XN", 
		"SM", "RM", "NM", "DM", "MM", "TM", "CM", "LM", "PM", "VM", "GM", "HM", "QM", "BM", "FM", "ZM", "JM", "XM", 
		"SL", "RL", "NL", "DL", "ML", "TL", "CL", "LL", "PL", "VL", "GL", "HL", "QL", "BL", "FL", "ZL", "JL", "XL", 
		"SZ", "RZ", "NZ", "DZ", "MZ", "TZ", "CZ", "LZ", "PZ", "VZ", "GZ", "HZ", "QZ", "BZ", "FZ", "ZZ", "JZ", "XZ", 
		"SX", "RX", "NX", "DX", "MX", "TX", "CX", "LX", "PX", "VX", "GX", "HX", "QX", "BX", "FX", "ZX", "JX", "XX"
	];
	for(let end of bad_endings){
		if(word.slice(end.length * (-1)) == end && !word.slice(end.length * (-1)).includes('_')){
			match = false;
		}
	}
	return match;
}

function start_well(word){
	let match = true;
	const bad_starings = [
		"SS", "RS", "NS", "DS", "MS", "TS", "CS", "LS",       "VS", "GS", "HS", "QS", "BS", "FS", "ZS", "JS", "XS", 
		"SR", "RR", "NR",       "MR",             "LR",                   "HR", "QR",             "ZR", "JR", "XR", 
		"SN", "RN", "NN", "DN", "MN", "TN", "CN", "LN",       "VN", "GN", "HN", "QN", "BN", "FN", "ZN", "JN", "XN", 
		"SD", "RD", "ND", "DD", "MD", "TD", "CD", "LD", "PD", "VD", "GD", "HD", "QD", "BD", "FD", "ZD", "JD", "XD", 
		"SM", "RM", "NM", "DM", "MM", "TM", "CM", "LM", "PM", "VM", "GM", "HM", "QM", "BM", "FM", "ZM", "JM", "XM", 
		"ST", "RT", "NT", "DT", "MT", "TT", "CT", "LT", "PT", "VT", "GT", "HT", "QT", "BT", "FT", "ZT", "JT", "XT", 
		"SC", "RC", "NC", "DC", "MC", "TC", "CC", "LC", "PC", "VC", "GC", "HC", "QC", "BC", "FC", "ZC", "JC", "XC", 
		"SL", "RL", "NL",       "ML",             "LL",                   "HL", "QL",             "ZL", "JL", "XL", 
		"SP", "RP", "NP", "DP", "MP", "TP", "CP", "LP", "PP", "VP", "GP", "HP", "QP", "BP", "FP", "ZP", "JP", "XP", 
		"SV", "RV", "NV", "DV", "MV", "TV", "CV", "LV", "PV", "VV", "GV", "HV", "QV", "BV", "FV", "ZV", "JV", "XV", 
		"SG", "RG", "NG", "DG", "MG", "TG", "CG", "LG", "PG", "VG", "GG", "HG", "QG", "BG", "FG", "ZG", "JG", "XG", 
		"SH", "RH",       "DH", "MH", "TH", "CH",       "PH", "VH", "GH", "HH", "QH", "BH", "FH", "ZH", "JH", "XH", 
		"SQ", "RQ", "NQ", "DQ", "MQ", "TQ", "CQ", "LQ", "PQ", "VQ", "GQ", "HQ", "QQ", "BQ", "FQ", "ZQ", "JQ", "XQ", 
		"SB", "RB", "NB", "DB", "MB", "TB", "CB", "LB", "PB", "VB", "GB", "HB", "QB", "BB", "FB", "ZB", "JB", "XB", 
		"SF", "RF", "NF", "DF", "MF", "TF", "CF", "LF", "PF", "VF", "GF", "HF", "QF", "BF", "FF", "ZF", "JF", "XF", 
		"SZ", "RZ", "NZ", "DZ", "MZ", "TZ",       "LZ", "PZ", "VZ", "GZ", "HZ", "QZ", "BZ", "FZ", "ZZ", "JZ", "XZ", 
		"SJ", "RJ", "NJ", "DJ", "MJ", "TJ", "CJ", "LJ", "PJ", "VJ", "GJ", "HJ", "QJ", "BJ", "FJ", "ZJ", "JJ", "XJ", 
		"SX", "RX", "NX", "DX", "MX", "TX", "CX", "LX", "PX", "VX", "GX", "HX", "QX", "BX", "FX", "ZX", "JX", "XX"
	];
	for(let end of bad_starings){
		if(word.substring(0, end.length) == end && !word.substring(0, end.length).includes('_')){
			match = false;
		}
	}
	return match;
}

function dont_contains_bad_letters_combinations(word){
	let match = true;
	const bad_combinations = [
		"QA", "QE", "QI", "QO", "NP", "NB", "TM", 
		"NN", "DD", "MM", "TT", "CC", "LL", "PP", "VV", "GG", "HH", "QQ", "BB", "FF", "ZZ", "JJ", "XX"
	];
	for(let bad of bad_combinations){
		if(word.includes(bad) && !word.slice(bad.length * (-1)).includes('_')){
			match = false;
		}
	}
	return match;
}

// --------------------------------------------
// ----------------- PAINEL -------------------
// --------------------------------------------

// HTML do painel
function panel_html(){
	const inject = `
<div id='inject'>
<style>
#inject{
witdh: 25%;
height:50%;
position: absolute;
left: 50px;
top: 150px;
z-index:1;
background-color: #efefef;
}
.popup{
position: fixed;
top: 10%;
left: 5%;
display: inline;
cursor: auto;
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
z-index: 2;
background-color: #202945;
height: 75%;
width: 25%;
border-radius: 6px;
}
p{
z-index: 3;
color: #f3956a;
position: relative;
top: 5%;
left: 5%;
height: 90%;
width: 90%;
padding: 10px 10px 10px 10px;
border-radius: 6px;
border-style: solid;
border-width: 1px;
border-color: #f3956a;
overflow-y: scroll;
}
p button{
text-align: right;
}
.button-injection{
z-index: 3;
left: 50%;
transform: translateX(-50%);
bottom: -6%;
position: relative;
padding: 5px 10px 5px 10px;
border-radius: 6px;
display: block;
background-color: #d84a1b;
color: #ffffff;
text-align: center;
}
</style>
<div class="popup" id="popup-canva">
<p></p>
<button class="button-injection" type="button" onclick="print_standard_panel();">Palavras Possíveis</button>
</div>
</div>
`;
	return inject;
}

// Leitura do painel
function get_panel_next_line(){
	if (panel.innerHTML.split("<br>").length == 1){return 1}
	else{
		innerHTML_parts = panel.innerHTML.split("line_");
		last_part = innerHTML_parts[innerHTML_parts.length - 1];
		last_id = last_part.split('"')[0];
		return parseInt(last_id) + 1;
	}
}

// Comandos do painel
function insert_panel(){
	const body = document.getElementsByTagName('body')[0];
	body.insertAdjacentHTML("afterbegin", panel_html());
}

function remove_panel(){
	const inject = document.getElementById('inject');
	inject.remove();
}

function print_on_panel(stg, print_button_delete=false, print_button_write=false){
	const new_id = get_panel_next_line();
	const open_span = "<span id='line_" + new_id + "'>";
	const close_span = "<br></span>"
	const button_delete_line = "<button onclick='erase_line(" + new_id + ");'> &#10060; </button>";
	const button_write_word = "<button onclick='input_word(\"" + stg.split(" ").join("") + "\"); print_standard_panel();'> &#9989; </button>";
	let HTML_to_insert = open_span + stg;
	if(print_button_write){HTML_to_insert += button_write_word;}
	if(print_button_delete){HTML_to_insert += button_delete_line;}
	HTML_to_insert += close_span;
	panel.innerHTML += HTML_to_insert;
}

function clear_panel(){
	panel.innerHTML = ""
}

function erase_line(line_number){
	const line_id = "line_"+ line_number;
	const line_element = document.getElementById(line_id);
	line_element.remove();
}

// Escrita do painel
function print_standard_panel(){
	clear_panel();
	start_final_word();
	print_number_of_words();
	print_avaliable_letters();
	print_confirmed_letters();
	print_horizontal_line();
	print_first_words_suggestion();
	
	if (calc_number_of_combinations() > 2000){//limitar a 1s de processamento 
		print_current_permutations();
	}else{
		print_words_suggestion(get_possible_words());
	}
}

function print_number_of_words(){
	print_on_panel("Palavras possíveis: " + calc_number_of_combinations());
}

function print_avaliable_letters(){
	const avaliable = avaliable_letters();	
	print_on_panel("Letras disponíveis: ");
	print_on_panel(avaliable.split("").join(", "));
}

function print_confirmed_letters(){
	const confirmed = get_confirmed_letters();
	print_on_panel("Letras confirmadas: " + confirmed.split('').join(", "));
}

function print_horizontal_line(){
	print_on_panel("<hr>");
}

function print_first_words_suggestion(){
	//DOSAR e IMUNE = 77% das palavras. + TECLA = 88%.
	let initial_suggestions = ["DOSAR", "IMUNE", "TECLA"];
	for (let word of initial_suggestions){
		if(!get_all_panel_words().includes(word)){
			print_on_panel(word, true, true);
		}
	}
}

function print_words_suggestion(words_to_print){
	if (words_to_print == '' || words_to_print == null){return;}
	for(let word of words_to_print){
		print_on_panel(word, true, true);
	}
}

function print_current_permutations(){
	const permutations = get_current_permutations();
	if (permutations == [] || permutations == null || permutations.length == 0){return;}
	if (permutations[0].includes("_")){
		for (let word of permutations){
			print_on_panel(word.split('').join(' '), true);
		}
	}else{
		for (let word of permutations){
			print_on_panel(word.split('').join(' '), true, true);
		}
	}
}





































function test_filters (word){
	console.log("contains_confirmed_letters: " + contains_confirmed_letters(word));
	console.log("dont_contains_forbidden_letters: " + dont_contains_forbidden_letters(word));
	console.log("contains_green_on_right_place: " + contains_green_on_right_place(word));
	console.log("dont_contains_yellow_on_right_place: " + dont_contains_yellow_on_right_place(word));
	console.log("end_well: " + end_well(word));
	console.log("start_well: " + start_well(word));
	console.log("dont_contains_bad_letters_combinations: " + dont_contains_bad_letters_combinations(word));
}

function perf(len){
	let start = performance.now();
	// coloque o código abaixo
	start_final_word(len);
	get_possible_words();
	let duration = performance.now() - start;
	console.log(final_word);
	console.log(duration);
}


// Refresh no painel ao escrever uma palavra
document.addEventListener("keypress", function(e){
	if(e.key === "Enter"){
		print_standard_panel();
	}
});

function print_letters(){
	const w = "AEOSRINDMUTCLPVGHQBFZJX";
	let stg = '';
	for (let la of w){
		for (let lb of w){
			stg += '"' + lb + la + '", ';
		}
		stg += "\n";
	}
	console.log(stg);
}


