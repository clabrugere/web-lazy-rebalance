<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono"/>
	<script src="https://cdn.tailwindcss.com"></script>
	<title>Lazy balancer</title>
</svelte:head>

<script>
	import PositionComponent from './components/PositionComponent.svelte';
	import HeaderComponent from "./components/HeaderComponent.svelte";
	import FooterComponent from './components/FooterComponent.svelte';

	import { Position } from './utils/models.js';
	import { to_currency, to_percentage } from './utils/formatters.js';
	import { balance } from './utils/balancer';
	

	function get_next_id() {
		let current_max_id = Math.max.apply(Math, positions.map(function(p) { return p.id; }));
		return current_max_id + 1;
	}
	
	function add() {
		positions = positions.concat(new Position(get_next_id()));
	}
	
	function remove(event) {
		positions = positions.filter(p => event.detail.id != p.id);
	}

	function validate_input(positions) {		
		let data_filled = positions.map(
			p => ['symbol', 'quantity', 'price', 'target_alloc'].every(prop => p.hasOwnProperty(prop))
		).reduce((a, b) => a && b); // every input must be filled
		let alloc_sum = positions.reduce((a, b) => a + b.target_alloc, 0) == 100; // allocations must sum to 100
		let symbol_unique = new Set(positions.map(p => p.symbol)).size == positions.length; // symbols must be unique
		return data_filled && alloc_sum && symbol_unique;
	}

	function handleBalance() {
		let result = balance(positions, cash);
		positions = result.positions;
		cash_left = result.cash_left;
	}
	
	let positions = [
		new Position(1, "CW8", 53, 423.22, 85),
		new Position(2, "PAEEM", 50, 24.42, 5),
		new Position(3, "RS2K", 6, 272.24, 6),
		new Position(4, "EESM", 1, 311.34, 4),
	];
	let cash = 1000;
	let cash_left = cash;

	$: valid_input = validate_input(positions); // validation of the inputs before balancing
	$: portfolio_value = positions.reduce((a, b) => a + b.value, 0) + (+cash || 0); // total value of the assets, including cash
	
</script>

<HeaderComponent />
<main class="container flex content-center justify-center py-4 px-16 mt-4">
	<div class="flex-col content-center p-4 mr-4">
		<p class="mb-4 text-center text-l">{to_currency(portfolio_value)}</p>
		<div class="flex gap-4 mb-4">
			<input class="w-2/3" type="number" placeholder="cash" min="0" bind:value={cash}/>
			<div class="flex-1 text-right">{to_percentage(cash / portfolio_value)}</div>
		</div>
		<button class="w-full" disabled={!valid_input} on:click={handleBalance}>balance</button>
	</div>
	<ul class="flex flex-col p-4 gap-4">
		{#each positions as position}
			<PositionComponent bind:position={position} {portfolio_value} on:message={remove}/>
		{/each}
		<button on:click={add}>+</button>
	</ul>
</main>
<FooterComponent />