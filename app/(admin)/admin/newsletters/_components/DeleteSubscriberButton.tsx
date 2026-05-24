"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteSubscriber } from "../../_actions/newsletters";

export default function DeleteSubscriberButton({ id }: { id: number }) {
	const [pending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const handleClick = () => {
		if (!window.confirm("Remove this subscriber?")) return;
		startTransition(async () => {
			const result = await deleteSubscriber(id);
			if (result.error) setError(result.error);
		});
	};

	return (
		<span className="inline-flex items-center gap-2">
			<button
				onClick={handleClick}
				disabled={pending}
				className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
			>
				<Trash2 size={12} />
				{pending ? "Removing..." : "Remove"}
			</button>
			{error && <span className="text-xs text-red-500">{error}</span>}
		</span>
	);
}
