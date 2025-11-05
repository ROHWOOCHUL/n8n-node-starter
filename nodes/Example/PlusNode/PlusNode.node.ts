import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class PlusNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PlusNode',
		name: 'plusNode',
		icon: { light: 'file:example.svg', dark: 'file:example.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Plus Node',
		},
		//어떤 인풋을 왼쪽에서 받을지
		inputs: [NodeConnectionTypes.Main],
		//어떤 아웃풋을 오른쪽으로 넣어줄 것인지
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Number1',
				name: 'number1',
				type: 'number',
				default: '',
				placeholder: '값 입력해주세요.',
				description: '첫 번째 숫자',
			},
			{
				displayName: 'Number2',
				name: 'number2',
				type: 'number',
				default: '',
				placeholder: '값 입력해주세요.',
				description: '두 번째 숫자',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let number1: number;
		let number2: number;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				number1 = this.getNodeParameter('number1', itemIndex, 0) as number;
				number2 = this.getNodeParameter('number2', itemIndex, 0) as number;
				item = items[itemIndex];

				item.json.sum = number1 + number2;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
