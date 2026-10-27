document.querySelectorAll('form[action^="https://formspree.io/"]').forEach((form) => {
	const submitButton = form.querySelector('button[type="submit"]');
	const status = document.querySelector(`[data-form-status="${form.id}"]`);

	if (!(submitButton instanceof HTMLButtonElement) || !(status instanceof HTMLParagraphElement)) {
		console.error(`Form status or submit button is missing for #${form.id}.`);
		return;
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		submitButton.disabled = true;
		status.hidden = false;
		status.dataset.state = "sending";
		status.textContent = "Sending your message...";

		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: new FormData(form),
				headers: { Accept: "application/json" }
			});

			if (!response.ok) {
				throw new Error(`The form service returned error ${response.status}. Please try again.`);
			}

			form.reset();
			status.dataset.state = "success";
			status.textContent = "Thanks! Your message has been sent.";
		} catch (error) {
			status.dataset.state = "error";
			status.textContent = error instanceof Error
				? `Your message couldn't be sent: ${error.message}`
				: "Your message couldn't be sent. Please try again.";
		} finally {
			submitButton.disabled = false;
		}
	});
});
