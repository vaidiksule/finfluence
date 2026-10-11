import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

test('every prior graph edge connects canonical entities', async () => {
  const entities = await readJson('../src/data/entities.json');
  const graph = await readJson('../src/data/prior_graph.json');
  const ids = new Set(entities.entities.map((entity) => entity.id));

  for (const edge of graph.edges) {
    assert.ok(ids.has(edge.source), `${edge.id} has an unknown source: ${edge.source}`);
    assert.ok(ids.has(edge.target), `${edge.id} has an unknown target: ${edge.target}`);
  }
});

test('replay scenarios contain enough information for an auditable article record', async () => {
  for (const scenario of ['oil_spike_2022', 'rate_hike_cycle']) {
    const articles = await readJson(`../src/data/replay/${scenario}.json`);
    assert.ok(articles.length > 0, `${scenario} must contain articles`);
    for (const article of articles) {
      assert.equal(typeof article.title, 'string');
      assert.equal(typeof article.summary, 'string');
      assert.equal(typeof article.source, 'string');
      assert.match(article.published_at, /^\d{4}-\d{2}-\d{2}T/);
    }
  }
});
