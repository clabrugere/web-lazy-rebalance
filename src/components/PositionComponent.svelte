<script>
    import { createEventDispatcher } from 'svelte';
    import { to_currency, to_percentage } from '../utils/formatters.js';

    export let position;
    export let portfolio_value;

    const dispatch = createEventDispatcher();

	function remove_self() {
		dispatch('message', {
			id: position.id
		});
	}
	
</script>

<li class="flex flex-row">
    <div class="flex flex-row gap-2">
        <button on:click={remove_self}>-</button>
        <input type="text" placeholder="symbol" bind:value={position.symbol}/>
        <input type="number" placeholder="quantity" min="0" bind:value={position.quantity}/>
        <input type="number" placeholder="price" min="0" bind:value={position.price}/>
        <input type="number" placeholder="target allocation" min="0" bind:value={position.target_alloc}/>
        <div class="text-center w-full">{to_percentage(position.value / portfolio_value)}</div>
        <div class="text-center w-full">{to_currency(position.value)}</div>
    </div>
    <div class="flex flex-row items-center w-1/4">
        <div class="text-center w-full">{position.order.quantity}</div>
        <div class="text-center w-full">{to_percentage(position.balanced_alloc)}</div>
        <div class="text-center w-full">{to_currency(position.order.quantity * position.price)}</div>
        <div class="text-center w-full">{to_currency(position.order.fee)}</div>
    </div>
</li>