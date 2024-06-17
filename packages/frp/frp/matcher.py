from langchain_core import runnables
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


class Matcher:
    def __init__(self):
        # Build up the LangChain chain for handling the matching
        prompt_template = self._get_prompt_template()
        model = self._get_model()
        output_parser = self._get_output_parser()

        self._chain = prompt_template | model | output_parser

    def _get_prompt_template(self) -> runnables.Runnable:
        return ChatPromptTemplate.from_messages([
            ( 'system',
             '''
             You are an assistant tasked with classifying whether the given publication title is associated with the given research topic.

Specifically, the content should be marked as relevant if it involves:
    1. Publications which are likely to have been written based on the research topic as a prompt.
    2. If the publication title has overlap with the research topic.

Generate a short response indicating whether the content meets any of the above criteria. Respond with "Yes" for relevance or "No" if the publication does not have high overlap.
             '''),
            ('human', '''
             Assess the given headline and article body based on the specified criteria. Provide a concise response indicating relevance.

Publication Title: {publication_title}

Research Topic: {frp_title}
             ''')
        ])

    def _get_model(self) -> runnables.Runnable:
        return Ollama(base_url='https://ollama-sail-24887a.apps.shift.nerc.mghpcc.org', model='llama2:13b')

    def _get_output_parser(self) -> runnables.Runnable:
        return StrOutputParser()

    def match(self, mapping: dict[str, str]) -> bool:
        """
        Handles running the matching logic against a specific
        prompt. The mapping is between specific identifiers
        and their coorespoding value. For example

        .. code-block:: python
           mapping = {
               'publication_title': 'Title example',
               'abstract': 'Abstract example'
           }
        """
        print('begin')
        try:
            result = self._chain.invoke(mapping)
        except Exception as e:
            print(e)
        return True
